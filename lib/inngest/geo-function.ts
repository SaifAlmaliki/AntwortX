import Anthropic from "@anthropic-ai/sdk";
import { inngest } from "./client";
import { fetchWebsite } from "../geo/fetch-website";
import { runAgent } from "../geo/run-agent";
import { computeCompositeScore } from "../geo/scoring";
import { generatePDF } from "../pdf/generate-pdf";
import { sendReportEmail } from "../email/sender";
import { buildAIVisibilityMessage } from "../geo/messages/ai-visibility";
import { buildContentMessage } from "../geo/messages/content";
import { buildTechnicalMessage } from "../geo/messages/technical";
import { buildPlatformMessage } from "../geo/messages/platform";
import { buildSchemaMessage } from "../geo/messages/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _inngest = inngest as any;
export const geoAnalysisFunction = _inngest.createFunction(
  {
    id: "geo-analysis",
    name: "GEO Website Analysis",
    retries: 2,
    concurrency: { limit: 5 },
    triggers: [{ event: "geo/analysis.requested" }],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ event, step }: { event: any; step: any }) => {
    const { url, email, company } = event.data as {
      url: string;
      email: string;
      company: string;
    };

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Step 1: Fetch and parse the target website (no AI)
    const pageData = await step.run("fetch-website", () =>
      fetchWebsite(url)
    );

    // Step 2: Run 5 parallel GEO agents
    const [visibility, content, technical, platform, schema] =
      await Promise.all([
        step.run("agent-ai-visibility", () =>
          runAgent(client, "geo-ai-visibility", buildAIVisibilityMessage(pageData))
        ),
        step.run("agent-content", () =>
          runAgent(client, "geo-content", buildContentMessage(pageData))
        ),
        step.run("agent-technical", () =>
          runAgent(client, "geo-technical", buildTechnicalMessage(pageData))
        ),
        step.run("agent-platform", () =>
          runAgent(client, "geo-platform-analysis", buildPlatformMessage(pageData))
        ),
        step.run("agent-schema", () =>
          runAgent(client, "geo-schema", buildSchemaMessage(pageData))
        ),
      ]);

    // Step 3: Compute composite GEO score
    const agents = { visibility, content, technical, platform, schema };
    const composite = await step.run("compute-score", () =>
      Promise.resolve(computeCompositeScore(agents))
    );

    // Step 4: Generate PDF report
    const pdfBuffer = await step.run("generate-pdf", () =>
      generatePDF({ url, company, composite, agents })
    );

    // Step 5: Send report email with PDF attachment
    await step.run("send-report-email", () =>
      sendReportEmail({ email, url, company, composite, pdfBuffer })
    );

    return { url, email, overallScore: composite.overall, grade: composite.grade };
  }
);
