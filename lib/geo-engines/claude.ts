import Anthropic from '@anthropic-ai/sdk';
import type { EngineClient, EngineResponse } from './types';
import { extractContext, analyzeSentiment, countMentions, checkCitation } from './helpers';

export class ClaudeEngine implements EngineClient {
  name = 'claude';
  private client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async query(
    prompt: string,
    brandName: string,
    websiteUrl: string
  ): Promise<EngineResponse> {
    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const mentioned = text.toLowerCase().includes(brandName.toLowerCase());
    const mentions = countMentions(text, brandName);
    const { cited, citationUrl } = checkCitation(text, websiteUrl);
    const sentiment = mentioned ? analyzeSentiment(text, brandName) : 'neutral';

    return {
      engine: this.name,
      prompt,
      response: text,
      mentioned,
      cited,
      citationUrl,
      sentiment,
      mentions,
      context: mentioned ? extractContext(text, brandName) : undefined,
    };
  }
}
