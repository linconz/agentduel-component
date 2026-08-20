export type AgentDuelAiModelLogoBrand =
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'gemma'
  | 'grok'
  | 'deepseek'
  | 'mistral'
  | 'llama'
  | 'qwen'
  | 'minimax'
  | 'kimi'
  | 'glm'
  | 'ernie'
  | 'hunyuan'
  | 'doubao'
  | 'cohere'
  | 'ai21'
  | 'amazon-nova'
  | 'phi'
  | 'granite'
  | 'nemotron'
  | 'perplexity'
  | 'yi'
  | 'internlm'
  | 'falcon'
  | 'baichuan'
  | 'stepfun'
  | 'iflytek-spark'
  | 'sensenova'
  | 'dbrx'
  | 'stablelm'
  | 'trae'
  | 'workbuddy'
  | 'qoder';

export interface AgentDuelAiModelLogo {
  brand: AgentDuelAiModelLogoBrand;
  label: string;
  fileName: string;
}

interface NormalizedAiModelName {
  raw: string;
  words: string;
  compact: string;
  tokens: readonly string[];
}

interface AgentDuelAiModelLogoDefinition extends AgentDuelAiModelLogo {
  words?: readonly string[];
  phrases?: readonly string[];
  compactIncludes?: readonly string[];
  regexes?: readonly RegExp[];
}

const AGENTDUEL_WEBSITE_URL = 'https://www.agentduel.app';

const AGENTDUEL_AI_MODEL_LOGO_DEFINITIONS: readonly AgentDuelAiModelLogoDefinition[] = [
  {
    brand: 'qoder',
    label: 'Qoder',
    fileName: 'qoder.svg',
    words: ['qoder']
  },
  {
    brand: 'chatgpt',
    label: 'ChatGPT',
    fileName: 'chatgpt.svg',
    words: ['chatgpt', 'openai', 'gpt', 'codex', 'o1', 'o3', 'o4'],
    compactIncludes: ['gpt4', 'gpt5', 'gpt6']
  },
  {
    brand: 'claude',
    label: 'Claude',
    fileName: 'claude.svg',
    words: ['claude', 'anthropic', 'opus', 'sonnet', 'haiku']
  },
  {
    brand: 'gemini',
    label: 'Gemini',
    fileName: 'gemini.svg',
    words: ['gemini', 'bard']
  },
  {
    brand: 'gemma',
    label: 'Gemma',
    fileName: 'gemma.svg',
    words: ['gemma']
  },
  {
    brand: 'grok',
    label: 'Grok',
    fileName: 'grok.svg',
    words: ['grok', 'xai'],
    phrases: ['x ai']
  },
  {
    brand: 'deepseek',
    label: 'DeepSeek',
    fileName: 'deepseek.svg',
    words: ['deepseek'],
    phrases: ['deep seek']
  },
  {
    brand: 'mistral',
    label: 'Mistral',
    fileName: 'mistral.svg',
    words: ['mistral', 'mixtral', 'codestral', 'magistral', 'ministral', 'devstral']
  },
  {
    brand: 'nemotron',
    label: 'NVIDIA Nemotron',
    fileName: 'nemotron.svg',
    words: ['nemotron']
  },
  {
    brand: 'llama',
    label: 'Llama',
    fileName: 'llama.svg',
    words: ['llama']
  },
  {
    brand: 'qwen',
    label: 'Qwen',
    fileName: 'qwen.svg',
    words: ['qwen', 'qwq', 'qvq', 'tongyi'],
    compactIncludes: ['qwen', '通义', '千问']
  },
  {
    brand: 'minimax',
    label: 'MiniMax',
    fileName: 'minimax.svg',
    words: ['minimax', 'abab', 'm2', 'm3'],
    phrases: ['mini max']
  },
  {
    brand: 'kimi',
    label: 'Kimi',
    fileName: 'kimi.svg',
    words: ['kimi', 'moonshot']
  },
  {
    brand: 'glm',
    label: 'GLM',
    fileName: 'glm.svg',
    words: ['glm', 'zhipu', 'zai'],
    phrases: ['z ai'],
    compactIncludes: ['智谱']
  },
  {
    brand: 'ernie',
    label: 'ERNIE',
    fileName: 'ernie.svg',
    words: ['ernie'],
    compactIncludes: ['文心']
  },
  {
    brand: 'hunyuan',
    label: 'Hunyuan',
    fileName: 'hunyuan.svg',
    words: ['hunyuan'],
    compactIncludes: ['混元']
  },
  {
    brand: 'doubao',
    label: 'Doubao',
    fileName: 'doubao.svg',
    words: ['doubao', 'seed'],
    compactIncludes: ['豆包']
  },
  {
    brand: 'cohere',
    label: 'Cohere',
    fileName: 'cohere.svg',
    words: ['cohere'],
    phrases: ['command r', 'command a'],
    regexes: [/\bcommandr\b/, /\bcommanda\b/]
  },
  {
    brand: 'ai21',
    label: 'AI21',
    fileName: 'ai21.svg',
    words: ['ai21', 'jamba']
  },
  {
    brand: 'amazon-nova',
    label: 'Amazon Nova',
    fileName: 'amazon-nova.svg',
    words: ['nova'],
    phrases: ['amazon nova', 'bedrock nova']
  },
  {
    brand: 'phi',
    label: 'Microsoft Phi',
    fileName: 'phi.svg',
    words: ['phi'],
    compactIncludes: ['phi3', 'phi4']
  },
  {
    brand: 'granite',
    label: 'IBM Granite',
    fileName: 'granite.svg',
    words: ['granite', 'watsonx']
  },
  {
    brand: 'perplexity',
    label: 'Perplexity',
    fileName: 'perplexity.svg',
    words: ['perplexity', 'sonar']
  },
  {
    brand: 'yi',
    label: 'Yi',
    fileName: 'yi.svg',
    words: ['01ai'],
    phrases: ['01 ai'],
    compactIncludes: ['零一万物'],
    regexes: [/\byi (?=\d|coder|large|light|vision|vl)/, /\byi\d/]
  },
  {
    brand: 'internlm',
    label: 'InternLM',
    fileName: 'internlm.svg',
    words: ['internlm', 'internvl'],
    compactIncludes: ['internlm', 'internvl', '书生']
  },
  {
    brand: 'falcon',
    label: 'Falcon',
    fileName: 'falcon.svg',
    words: ['falcon']
  },
  {
    brand: 'baichuan',
    label: 'Baichuan',
    fileName: 'baichuan.svg',
    words: ['baichuan'],
    compactIncludes: ['baichuan', '百川']
  },
  {
    brand: 'stepfun',
    label: 'StepFun',
    fileName: 'stepfun.svg',
    words: ['stepfun'],
    compactIncludes: ['阶跃星辰', '跃问'],
    regexes: [/\bstep [123]\b/, /\bstep[123]\b/]
  },
  {
    brand: 'iflytek-spark',
    label: 'iFLYTEK Spark',
    fileName: 'iflytek-spark.svg',
    words: ['iflytek', 'sparkdesk'],
    compactIncludes: ['讯飞', '星火'],
    regexes: [/\bspark (?=x1|\d)/]
  },
  {
    brand: 'sensenova',
    label: 'SenseNova',
    fileName: 'sensenova.svg',
    words: ['sensenova', 'sensechat', 'sensetime'],
    compactIncludes: ['日日新', '商量']
  },
  {
    brand: 'dbrx',
    label: 'DBRX',
    fileName: 'dbrx.svg',
    words: ['dbrx', 'databricks']
  },
  {
    brand: 'stablelm',
    label: 'StableLM',
    fileName: 'stablelm.svg',
    words: ['stablelm', 'stablecode'],
    phrases: ['stable lm', 'stable code']
  },
  {
    brand: 'trae',
    label: 'TRAE',
    fileName: 'trae.svg',
    words: ['trae']
  },
  {
    brand: 'workbuddy',
    label: 'WorkBuddy',
    fileName: 'workbuddy.svg',
    words: ['workbuddy'],
    phrases: ['work buddy']
  }
];

export const AGENTDUEL_AI_MODEL_LOGOS: readonly AgentDuelAiModelLogo[] =
  AGENTDUEL_AI_MODEL_LOGO_DEFINITIONS.map((definition) => ({
    brand: definition.brand,
    label: definition.label,
    fileName: definition.fileName
  }));

export function getAgentDuelAiModelLogo(
  aiModel: string | null | undefined
): AgentDuelAiModelLogo | null {
  if (typeof aiModel !== 'string') {
    return null;
  }

  const normalized = normalizeAiModelName(aiModel);
  if (normalized.raw.length === 0) {
    return null;
  }

  const match = AGENTDUEL_AI_MODEL_LOGO_DEFINITIONS.find((definition) => (
    matchesDefinition(normalized, definition)
  ));
  if (!match) {
    return null;
  }

  return {
    brand: match.brand,
    label: match.label,
    fileName: match.fileName
  };
}

export function getAgentDuelAiModelLogoAssetUrl(fileName: string): string {
  const path = fileName === 'qoder.svg'
    ? `/model/${fileName}`
    : `/model/logos/${fileName}`;
  return `${AGENTDUEL_WEBSITE_URL}${path}`;
}

function normalizeAiModelName(aiModel: string): NormalizedAiModelName {
  const raw = aiModel.normalize('NFKC').toLowerCase().trim();
  const words = raw
    .replace(/[-\u2010-\u2015_./+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const compact = words.replace(/\s+/g, '');
  const tokens = words.length > 0 ? words.split(' ') : [];

  return { raw, words, compact, tokens };
}

function matchesDefinition(
  model: NormalizedAiModelName,
  definition: AgentDuelAiModelLogoDefinition
): boolean {
  return hasMatchingWord(model, definition.words)
    || hasMatchingPhrase(model, definition.phrases)
    || hasMatchingCompactTerm(model, definition.compactIncludes)
    || hasMatchingRegex(model, definition.regexes);
}

function hasMatchingWord(
  model: NormalizedAiModelName,
  words: readonly string[] | undefined
): boolean {
  return words?.some((word) => model.tokens.includes(word)) ?? false;
}

function hasMatchingPhrase(
  model: NormalizedAiModelName,
  phrases: readonly string[] | undefined
): boolean {
  if (!phrases) {
    return false;
  }
  const paddedWords = ` ${model.words} `;
  return phrases.some((phrase) => paddedWords.includes(` ${phrase} `));
}

function hasMatchingCompactTerm(
  model: NormalizedAiModelName,
  terms: readonly string[] | undefined
): boolean {
  return terms?.some((term) => model.compact.includes(term)) ?? false;
}

function hasMatchingRegex(
  model: NormalizedAiModelName,
  regexes: readonly RegExp[] | undefined
): boolean {
  return regexes?.some((regex) => regex.test(model.words) || regex.test(model.compact)) ?? false;
}
