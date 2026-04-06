import { GoogleGenerativeAI } from '@google/generative-ai';
import type { EngineClient, EngineResponse } from './types';
import { extractContext, analyzeSentiment, countMentions, checkCitation } from './helpers';

export class GeminiEngine implements EngineClient {
  name = 'gemini';
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  }

  async query(
    prompt: string,
    brandName: string,
    websiteUrl: string
  ): Promise<EngineResponse> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
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
