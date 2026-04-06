export interface EngineResponse {
  engine: string;
  prompt: string;
  response: string;
  mentioned: boolean;
  cited: boolean;
  citationUrl?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  mentions: number;
  context?: string;
  snippets?: string[];
}

export interface EngineClient {
  name: string;
  query(prompt: string, brandName: string, websiteUrl: string): Promise<EngineResponse>;
}

export interface EngineConfig {
  brandName: string;
  websiteUrl: string;
  category: string;
  competitors?: string[];
}
