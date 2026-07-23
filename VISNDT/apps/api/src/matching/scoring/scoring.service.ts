import { Injectable } from '@nestjs/common';
import { ParameterDataType } from '@prisma/client';
import { ParameterScore, ScoreResult } from '../types/parameter-score';
import { DemandParamForMatch, ProductCandidate, ProductParamForMatch, DEFAULT_MATCH_CONFIG } from '../types/match-context';

@Injectable()
export class ScoringService {
  /**
   * 计算 Demand 与单个 Product 的匹配总分
   */
  calculateScore(
    demandParams: DemandParamForMatch[],
    candidate: ProductCandidate,
  ): ScoreResult {
    const parameterScores: ParameterScore[] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;
    let matchedCount = 0;

    // 构建产品参数索引 (parameterDefinitionId → ProductParamForMatch)
    const productParamMap = new Map<string, ProductParamForMatch>();
    for (const pv of candidate.parameterValues) {
      productParamMap.set(pv.parameterDefinitionId, pv);
    }

    for (const dp of demandParams) {
      const weight = dp.priority > 0 ? dp.priority : DEFAULT_MATCH_CONFIG.defaultPriority;
      const productParam = productParamMap.get(dp.parameterDefinitionId);

      const paramScore = this.matchParameter(dp, productParam, weight);
      parameterScores.push(paramScore);

      totalWeightedScore += paramScore.score * weight;
      totalWeight += weight;

      if (paramScore.score > 0) {
        matchedCount++;
      }

      // Hard fail: required parameter not matched
      if (dp.required && paramScore.score === 0) {
        const totalScore = 0;
        return {
          totalScore,
          parameterScores,
          totalParameters: demandParams.length,
          matchedParameters: matchedCount,
          matchRate: demandParams.length > 0 ? matchedCount / demandParams.length : 1,
          hardFail: true,
          failReason: `Required parameter "${dp.parameterDefinition.name}" (${dp.parameterDefinition.code}) not matched`,
        };
      }
    }

    const totalScore = totalWeight > 0
      ? Math.round((totalWeightedScore / totalWeight) * 100) / 100
      : 100; // No parameters → perfect match

    return {
      totalScore,
      parameterScores,
      totalParameters: demandParams.length,
      matchedParameters: matchedCount,
      matchRate: demandParams.length > 0 ? matchedCount / demandParams.length : 1,
      hardFail: false,
    };
  }

  /**
   * 匹配单个参数
   */
  private matchParameter(
    demandParam: DemandParamForMatch,
    productParam: ProductParamForMatch | undefined,
    weight: number,
  ): ParameterScore {
    const base: Omit<ParameterScore, 'score' | 'type'> = {
      parameterDefinitionId: demandParam.parameterDefinitionId,
      parameterName: demandParam.parameterDefinition.name,
      parameterCode: demandParam.parameterDefinition.code,
      dataType: demandParam.parameterDefinition.dataType,
      demandValue: demandParam.value,
      demandRange: demandParam.valueMin !== null || demandParam.valueMax !== null
        ? { min: demandParam.valueMin ?? -Infinity, max: demandParam.valueMax ?? Infinity }
        : null,
      productValue: productParam?.value ?? null,
      productValueNumber: productParam?.valueNumber ?? null,
      weight,
      required: demandParam.required,
      unit: demandParam.parameterDefinition.unit,
    };

    // Product has no value for this parameter
    if (!productParam) {
      return { ...base, score: 0, type: 'exact' };
    }

    switch (demandParam.parameterDefinition.dataType) {
      case ParameterDataType.NUMBER:
        return {
          ...base,
          score: this.rangeMatch(demandParam.valueMin, demandParam.valueMax, productParam.valueNumber),
          type: 'range',
        };

      case ParameterDataType.ENUM:
        return {
          ...base,
          score: this.enumMatch(demandParam.value, productParam.value),
          type: 'enum',
        };

      case ParameterDataType.STRING:
      case ParameterDataType.BOOLEAN:
      default:
        return {
          ...base,
          score: this.exactMatch(demandParam.value, productParam.value),
          type: 'exact',
        };
    }
  }

  /**
   * 精确匹配：比较字符串值（大小写不敏感，去除首尾空格）
   */
  private exactMatch(demandValue: string | null, productValue: string | null): number {
    if (!demandValue || !productValue) return 0;
    return demandValue.toLowerCase().trim() === productValue.toLowerCase().trim()
      ? 100
      : 0;
  }

  /**
   * 枚举匹配：本质是精确匹配
   */
  private enumMatch(demandValue: string | null, productValue: string | null): number {
    return this.exactMatch(demandValue, productValue);
  }

  /**
   * 数值范围匹配：检查 productValueNumber 是否在 [valueMin, valueMax] 范围内
   */
  private rangeMatch(
    valueMin: number | null,
    valueMax: number | null,
    productValue: number | null,
  ): number {
    if (productValue === null || productValue === undefined) return 0;

    const min = valueMin ?? -Infinity;
    const max = valueMax ?? Infinity;

    if (productValue >= min && productValue <= max) {
      return 100;
    }

    // 部分得分：基于偏离度
    if (productValue < min && min !== -Infinity && min !== 0) {
      const deviation = (min - productValue) / min;
      return Math.max(0, Math.round((1 - deviation) * 100));
    }

    if (productValue > max && max !== Infinity && max !== 0) {
      const deviation = (productValue - max) / max;
      return Math.max(0, Math.round((1 - deviation) * 100));
    }

    return 0;
  }
}