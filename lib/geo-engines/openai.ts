import OpenAI from 'openai';
import type { EngineClient, EngineResponse } from './types';
import { extractContext, analyzeSentiment, countMentions, checkCitation } from './helpers';

export class OpenAIEngine implements EngineClient {
  name = 'openai';
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async query(
    prompt: string,
    brandName: string,
    websiteUrl: string
  ): Promise<EngineResponse> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content || '';
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
