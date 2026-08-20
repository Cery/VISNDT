/**
 * VISNDT Capability Glossary — deterministic semantic mapping (Visual Layer only).
 *
 * 参数/分类的「能力解释」由静态词表确定性推导，不涉及 AI / 检索 / 评分。
 * 与 `translate.ts` 同属前端展示层：不改数据结构、不改 API 契约。
 */

/** A single parameter capability hint rule (name/code → Chinese capability phrase). */
interface ParameterHintRule {
  keywords: string[];
  hint: string;
}

/** 工业检测参数 → 能力解释（按 name/code 子串匹配，命中即返回，顺序即优先级） */
const PARAMETER_HINTS: ParameterHintRule[] = [
  { keywords: ['tube diameter', 'probe diameter', 'insertion tube', 'probe size'], hint: '适用于微细空间内部检测' },
  { keywords: ['resolution', 'pixel'], hint: '高分辨率成像，捕捉清晰细节' },
  { keywords: ['field of view', 'fov', 'view angle'], hint: '更广视野，单次覆盖更大检测区域' },
  { keywords: ['working length', 'insertion length', 'probe length', 'cable length', 'reach'], hint: '深入长距离内部空间探测' },
  { keywords: ['illumination', 'light source', 'led', 'brightness'], hint: '自带照明，暗处成像清晰' },
  { keywords: ['magnification', 'zoom'], hint: '高倍放大，观测细微缺陷' },
  { keywords: ['temperature range', 'operating temperature', 'ip rating', 'waterproof', 'ingress'], hint: '适应宽温与恶劣工业环境' },
  { keywords: ['measurement accuracy', 'accuracy', 'precision', 'tolerance'], hint: '精确测量，提供可靠定量结果' },
  { keywords: ['frame rate', 'fps', 'refresh'], hint: '高帧率实时显示，捕捉动态细节' },
  { keywords: ['depth of field', 'dof', 'focus'], hint: '较大景深，减少反复调焦操作' },
  { keywords: ['weight', 'mass'], hint: '轻量化设计，便于便携现场作业' },
  { keywords: ['power supply', 'battery', 'voltage'], hint: '便携供电，适配现场移动检测' },
];

/** 检测分类 → 检测场景描述（按英文分类名子串匹配） */
interface ScenarioRule {
  keywords: string[];
  scenario: string;
}

const CATEGORY_SCENARIOS: ScenarioRule[] = [
  { keywords: ['endoscope', 'borescope'], scenario: '深入狭小或不可见空间，进行内部目视检测' },
  { keywords: ['measurement'], scenario: '高精度尺寸测量与几何量检测' },
  { keywords: ['inspection camera', 'camera'], scenario: '表面缺陷与外观质量视觉检测' },
  { keywords: ['ultrasonic'], scenario: '材料内部缺陷的超声无损探伤' },
  { keywords: ['radiographic', 'x-ray', 'x ray'], scenario: '内部结构与缺陷的射线透视检测' },
  { keywords: ['magnetic particle'], scenario: '铁磁性材料表面/近表面缺陷检测' },
  { keywords: ['penetrant'], scenario: '非多孔材料表面开口缺陷检测' },
  { keywords: ['eddy current'], scenario: '导电材料表面/近表面缺陷检测' },
  { keywords: ['crawler', 'pipeline'], scenario: '管道内部爬行检测与缺陷定位' },
  { keywords: ['thermal'], scenario: '温度分布与热缺陷检测' },
  { keywords: ['thickness'], scenario: '壁厚/涂层厚度精确测量' },
  { keywords: ['visual'], scenario: '目视/机器视觉外观质量检测' },
];

function firstMatch(name: string, rules: { keywords: string[] }[], fallback: null = null) {
  const normalized = name.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((k) => normalized.includes(k))) {
      return rule;
    }
  }
  return fallback;
}

/**
 * 返回指定参数的「能力解释」；无匹配返回 null（不展示，避免臆造）。
 */
export function getParameterCapabilityHint(name: string, code?: string | null): string | null {
  const byName = firstMatch(name, PARAMETER_HINTS) as ParameterHintRule | null;
  if (byName) return byName.hint;
  if (code) {
    const byCode = firstMatch(code, PARAMETER_HINTS) as ParameterHintRule | null;
    if (byCode) return byCode.hint;
  }
  return null;
}

/**
 * 返回指定分类的「检测场景」描述；无匹配返回 null。
 */
export function getCategoryScenario(categoryName: string): string | null {
  const rule = firstMatch(categoryName, CATEGORY_SCENARIOS) as ScenarioRule | null;
  return rule?.scenario ?? null;
}