import { ParameterDataType } from '@prisma/client';

/** 匹配上下文：Demand + 候选产品 */
export interface MatchContext {
  demandId: string;
  demandParams: DemandParamForMatch[];
  candidates: ProductCandidate[];
  config: MatchConfig;
}

export interface DemandParamForMatch {
  id: string;
  parameterDefinitionId: string;
  parameterDefinition: {
    id: string;
    name: string;
    code: string;
    dataType: ParameterDataType;
    unit: string | null;
  };
  value: string | null;
  valueMin: number | null;
  valueMax: number | null;
  required: boolean;
  priority: number;
}

export interface ProductCandidate {
  id: string;
  name: string;
  parameterValues: ProductParamForMatch[];
  offers: CandidateOffer[];
}

export interface ProductParamForMatch {
  parameterDefinitionId: string;
  value: string;
  valueNumber: number | null;
  parameterDefinition: {
    id: string;
    name: string;
    code: string;
    dataType: ParameterDataType;
    unit: string | null;
  };
}

export interface CandidateOffer {
  id: string;
  organizationId: string;
  status: string;
}

export interface MatchConfig {
  /** 最低匹配分数阈值 */
  minMatchScore: number;
  /** 每个 Demand 最多保留匹配数 */
  maxMatchesPerDemand: number;
  /** 默认参数权重 */
  defaultPriority: number;
}

export const DEFAULT_MATCH_CONFIG: MatchConfig = {
  minMatchScore: 40,
  maxMatchesPerDemand: 50,
  defaultPriority: 1,
};