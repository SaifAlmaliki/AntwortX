import type { EngineClient, EngineResponse } from './types';
import { extractContext, analyzeSentiment, countMentions, checkCitation } from './helpers';

export class PerplexityEngine implements EngineClient {
  name = 'perplexity';
  private apiKey: string;

  constructor() {
    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY not configured');
    }
    this.apiKey = process.env.PERPLEXITY_API_KEY;
  }

  async query(
    prompt: string,
    brandName: string,
    websiteUrl: string
  ): Promise<EngineResponse> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
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
