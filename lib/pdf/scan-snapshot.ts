/** Factual audit scope shown early in the PDF for credibility. */
export interface ScanSnapshotInput {
  date: string;
  url: string;
  wordCount?: number;
  userCategory: string;
  extractedCategory?: string | null;
  extractedServices?: string[];
  targetAudience?: string | null;
  llmEngineCount: number;
  llmPromptsPerEngine: number;
}
