import { OpenAIEngine } from './openai';
import { PerplexityEngine } from './perplexity';
import { GeminiEngine } from './gemini';
import { ClaudeEngine } from './claude';
import type { EngineClient } from './types';

const engineMap: Record<string, () => EngineClient> = {
  openai: () => new OpenAIEngine(),
  perplexity: () => new PerplexityEngine(),
  gemini: () => new GeminiEngine(),
  claude: () => new ClaudeEngine(),
};

export function getEngine(name: string): EngineClient {
  const factory = engineMap[name];
  if (!factory) {
    throw new Error(`Unknown engine: ${name}. Available: ${Object.keys(engineMap).join(', ')}`);
  }
  return factory();
}

export function getAvailableEngines(): string[] {
  return Object.keys(engineMap);
}

export { OpenAIEngine, PerplexityEngine, GeminiEngine, ClaudeEngine };
export type { EngineClient, EngineResponse, EngineConfig } from './types';
