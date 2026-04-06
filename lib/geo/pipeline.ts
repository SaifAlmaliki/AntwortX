import Anthropic from "@anthropic-ai/sdk";
import { fetchWebsite } from "./fetch-website";
import { runAgent } from "./run-agent";
import { computeCompositeScore } from "./scoring";
import { buildAIVisibilityMessage } from "./messages/ai-visibility";
import { buildContentMessage } from "./messages/content";
import { buildTechnicalMessage } from "./messages/technical";
import { buildPlatformMessage } from "./messages/platform";
import { buildSchemaMessage } from "./messages/schema";
import type { WebsiteData, AgentResults, CompositeScore } from "./types";

export interface AnalysisResult {
  websiteData: WebsiteData;
  agents: AgentResults;
  composite: CompositeScore;
}

export async function runGeoAnalysis(websiteUrl: string): Promise<AnalysisResult> {
  const websiteData = await fetchWebsite(websiteUrl);

  if (websiteData.fetchError) {
    throw new Error(`Failed to fetch website: ${websiteData.fetchError}`);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const [visibility, content, technical, platform, schema] =
    await Promise.all([
      runAgent(client, "geo-ai-visibility", buildAIVisibilityMessage(websiteData)),
      runAgent(client, "geo-content", buildContentMessage(websiteData)),
      runAgent(client, "geo-technical", buildTechnicalMessage(websiteData)),
      runAgent(client, "geo-platform-analysis", buildPlatformMessage(websiteData)),
      runAgent(client, "geo-schema", buildSchemaMessage(websiteData)),
    ]);

  const agents: AgentResults = {
    visibility,
    content,
    technical,
    platform,
    schema,
  };

  const composite = computeCompositeScore(agents);

  return { websiteData, agents, composite };
}
