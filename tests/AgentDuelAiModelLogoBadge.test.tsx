import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AgentDuelAiModelLogoBadge } from '../src/AgentDuelAiModelLogoBadge';
import {
  AGENTDUEL_AI_MODEL_LOGOS,
  getAgentDuelAiModelLogo,
  getAgentDuelAiModelLogoAssetUrl
} from '../src/aiModelLogos';

const EXPECTED_LOGO_FILES = [
  'chatgpt.svg',
  'claude.svg',
  'gemini.svg',
  'gemma.svg',
  'grok.svg',
  'deepseek.svg',
  'mistral.svg',
  'llama.svg',
  'qwen.svg',
  'minimax.svg',
  'kimi.svg',
  'glm.svg',
  'ernie.svg',
  'hunyuan.svg',
  'doubao.svg',
  'cohere.svg',
  'ai21.svg',
  'amazon-nova.svg',
  'phi.svg',
  'granite.svg',
  'nemotron.svg',
  'perplexity.svg',
  'yi.svg',
  'internlm.svg',
  'falcon.svg',
  'baichuan.svg',
  'stepfun.svg',
  'iflytek-spark.svg',
  'sensenova.svg',
  'dbrx.svg',
  'stablelm.svg',
  'trae.svg',
  'workbuddy.svg',
  'qoder.svg'
] as const;

const MODEL_CASES = [
  ['GPT-5.6 Sol', 'chatgpt', 'chatgpt.svg'],
  ['o3-pro', 'chatgpt', 'chatgpt.svg'],
  ['OpenAI Codex', 'chatgpt', 'chatgpt.svg'],
  ['Claude 4.5 Sonnet', 'claude', 'claude.svg'],
  ['Opus 4.1', 'claude', 'claude.svg'],
  ['Gemini 2.5 Pro', 'gemini', 'gemini.svg'],
  ['Gemma 3', 'gemma', 'gemma.svg'],
  ['Grok-4', 'grok', 'grok.svg'],
  ['DeepSeek-R1', 'deepseek', 'deepseek.svg'],
  ['Mistral Large', 'mistral', 'mistral.svg'],
  ['Llama 4 Scout', 'llama', 'llama.svg'],
  ['MiniMax-M2', 'minimax', 'minimax.svg'],
  ['m3', 'minimax', 'minimax.svg'],
  ['Kimi K2', 'kimi', 'kimi.svg'],
  ['moonshot-v1-128k', 'kimi', 'kimi.svg'],
  ['Qwen3 Coder', 'qwen', 'qwen.svg'],
  ['通义千问 Max', 'qwen', 'qwen.svg'],
  ['GLM-4.5', 'glm', 'glm.svg'],
  ['智谱 GLM-Z1', 'glm', 'glm.svg'],
  ['Doubao-Seed-1.6', 'doubao', 'doubao.svg'],
  ['豆包 1.5 Pro', 'doubao', 'doubao.svg'],
  ['Hunyuan-T1', 'hunyuan', 'hunyuan.svg'],
  ['混元 Turbo', 'hunyuan', 'hunyuan.svg'],
  ['ERNIE-4.5', 'ernie', 'ernie.svg'],
  ['文心 X1', 'ernie', 'ernie.svg'],
  ['Command-R+', 'cohere', 'cohere.svg'],
  ['AI21 Jamba Large', 'ai21', 'ai21.svg'],
  ['Amazon Nova Pro', 'amazon-nova', 'amazon-nova.svg'],
  ['Phi-4', 'phi', 'phi.svg'],
  ['IBM Granite 4.1', 'granite', 'granite.svg'],
  ['Llama Nemotron Ultra', 'nemotron', 'nemotron.svg'],
  ['Perplexity Sonar Pro', 'perplexity', 'perplexity.svg'],
  ['Yi-34B-Chat', 'yi', 'yi.svg'],
  ['InternLM3', 'internlm', 'internlm.svg'],
  ['Falcon-H1', 'falcon', 'falcon.svg'],
  ['Baichuan4', 'baichuan', 'baichuan.svg'],
  ['Step-2 16K', 'stepfun', 'stepfun.svg'],
  ['讯飞星火 X1', 'iflytek-spark', 'iflytek-spark.svg'],
  ['SenseNova 5.5', 'sensenova', 'sensenova.svg'],
  ['DBRX Instruct', 'dbrx', 'dbrx.svg'],
  ['StableLM Zephyr', 'stablelm', 'stablelm.svg'],
  ['TRAE', 'trae', 'trae.svg'],
  ['WorkBuddy', 'workbuddy', 'workbuddy.svg'],
  ['work-buddy', 'workbuddy', 'workbuddy.svg'],
  ['work buddy v1', 'workbuddy', 'workbuddy.svg'],
  ['Qoder', 'qoder', 'qoder.svg'],
  ['qoder-cli', 'qoder', 'qoder.svg'],
  ['Qoder GPT-5', 'qoder', 'qoder.svg']
] as const;

describe('AI model logo registry', () => {
  it('contains every website model logo and resolves its absolute asset URL', () => {
    expect(AGENTDUEL_AI_MODEL_LOGOS).toHaveLength(EXPECTED_LOGO_FILES.length);

    for (const fileName of EXPECTED_LOGO_FILES) {
      expect(AGENTDUEL_AI_MODEL_LOGOS.some((logo) => logo.fileName === fileName)).toBe(true);
      expect(getAgentDuelAiModelLogoAssetUrl(fileName)).toBe(
        fileName === 'qoder.svg'
          ? 'https://www.agentduel.app/model/qoder.svg'
          : `https://www.agentduel.app/model/logos/${fileName}`
      );
    }
  });

  it.each(MODEL_CASES)('maps %s to %s', (input, brand, fileName) => {
    expect(getAgentDuelAiModelLogo(input)).toMatchObject({ brand, fileName });
  });

  it.each([null, undefined, '   ', 'unknown internal model', 'command line helper', 'step by step planner']) (
    'does not map an unknown model value %s',
    (input) => {
      expect(getAgentDuelAiModelLogo(input)).toBeNull();
    }
  );
});

describe('AgentDuelAiModelLogoBadge', () => {
  it('renders a known logo with an absolute website URL', () => {
    const html = renderToStaticMarkup(
      <AgentDuelAiModelLogoBadge aiModel="DeepSeek-R1" fallbackLabel="未知模型" />
    );

    expect(html).toContain('class="ai-model-logo-badge has-logo"');
    expect(html).toContain('title="DeepSeek: DeepSeek-R1"');
    expect(html).toContain('src="https://www.agentduel.app/model/logos/deepseek.svg"');
    expect(html).toContain('<span>DeepSeek-R1</span>');
  });

  it('renders fallback text for an empty or unknown model', () => {
    expect(renderToStaticMarkup(
      <AgentDuelAiModelLogoBadge aiModel={null} fallbackLabel="未知模型" />
    )).toContain('<span>未知模型</span>');

    expect(renderToStaticMarkup(
      <AgentDuelAiModelLogoBadge aiModel="Private Model" fallbackLabel="未知模型" />
    )).toContain('title="Private Model"');
  });

  it('can hide values without a registered logo', () => {
    expect(renderToStaticMarkup(
      <AgentDuelAiModelLogoBadge
        aiModel="Private Model"
        fallbackLabel="未知模型"
        hideWhenLogoMissing
      />
    )).toBe('');
  });
});
