// Shared types for GEO analysis pipeline

export interface ContentBlock {
  heading: string | null;
  content: string;
  wordCount: number;
}

export interface HeadingEntry {
  level: number;
  text: string;
}

export interface ImageEntry {
  src: string;
  alt: string;
  loading: string;
}

export interface RobotsTxtData {
  exists: boolean;
  content: string;
  aiCrawlerStatus: Record<string, "ALLOWED" | "BLOCKED" | "RESTRICTED" | "UNKNOWN">;
  hasSitemap: boolean;
}

export interface LlmsTxtData {
  exists: boolean;
  content: string;
  fullExists: boolean;
}

export interface SecurityHeaders {
  hsts: string | null;
  csp: string | null;
  xFrameOptions: string | null;
  xContentTypeOptions: string | null;
  referrerPolicy: string | null;
  permissionsPolicy: string | null;
}

export interface RedirectEntry {
  url: string;
  status: number;
}

export interface WebsiteData {
  url: string;
  domain: string;
  title: string;
  metaDescription: string;
  canonical: string | null;
  h1Tags: string[];
  headingStructure: HeadingEntry[];
  textContent: string;
  wordCount: number;
  structuredData: unknown[];
  metaTags: Record<string, string>;
  internalLinks: string[];
  externalLinks: string[];
  images: ImageEntry[];
  securityHeaders: SecurityHeaders;
  statusCode: number;
  redirectChain: RedirectEntry[];
  hasSSRContent: boolean;
  robotsTxt: RobotsTxtData;
  llmsTxt: LlmsTxtData;
  contentBlocks: ContentBlock[];
  fetchError: string | null;
}

export interface AgentResult {
  agentName: string;
  score: number;
  grade: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  rawMarkdown: string;
}

export interface AgentResults {
  visibility: AgentResult;
  content: AgentResult;
  technical: AgentResult;
  platform: AgentResult;
  schema: AgentResult;
}

export interface CompositeScore {
  overall: number;
  grade: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  breakdown: {
    citability: number;
    brand: number;
    eeat: number;
    technical: number;
    schema: number;
    platform: number;
  };
}
