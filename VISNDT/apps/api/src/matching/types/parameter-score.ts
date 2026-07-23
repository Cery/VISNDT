import { ParameterDataType } from '@prisma/client';

/** 单个参数的匹配得分 */
export interface ParameterScore {
  parameterDefinitionId: string;
  parameterName: string;
  parameterCode: string;
  dataType: ParameterDataType;
  demandValue: string | null;
  demandRange: { min: number; max: number } | null;
  productValue: string | null;
  productValueNumber: number | null;
  score: number;
  weight: number;
  required: boolean;
  type: 'exact' | 'range' | 'enum';
  unit: string | null;
}

/** 评分结果 */
export interface ScoreResult {
  /** 加权总分 (0-100) */
  totalScore: number;
  /** 各参数得分明细 */
  parameterScores: ParameterScore[];
  /** 总参数数 */
  totalParameters: number;
  /** 匹配成功的参数数 */
  matchedParameters: number;
  /** 匹配率 */
  matchRate: number;
  /** 是否为硬失败（required 参数不匹配） */
  hardFail: boolean;
  /** 失败原因 */
  failReason?: string;
}