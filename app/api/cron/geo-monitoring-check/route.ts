import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PromptGenerator } from "@/lib/geo-engines/prompt-generator";
import { getEngine } from "@/lib/geo-engines";
import { MetricsCalculator } from "@/lib/geo-metrics/calculator";

export const runtime = "nodejs";

const MAX_CHECKS_PER_RUN = parseInt(process.env.GEO_MONITORING_MAX_CHECKS_PER_RUN || "10");

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const now = new Date();

    const dueMonitoring = await prisma.gEOMonitoring.findMany({
      where: {
        isActive: true,
        nextCheckAt: { lte: now },
      },
      take: MAX_CHECKS_PER_RUN,
    });

    const results: Array<{ id: string; brandName: string; status: string }> = [];

    for (const monitoring of dueMonitoring) {
      try {
        const check = await prisma.gEOCheck.create({
          data: {
            monitoringId: monitoring.id,
            status: "running",
          },
        });

        const prompts = PromptGenerator.generatePrompts(
          monitoring.category,
          monitoring.brandName,
          10
        );

        const engineResults: Record<string, any> = {};
        const promptResults: any[] = [];

        for (const prompt of prompts) {
          const enginesData: Record<string, any> = {};

          for (const engineName of monitoring.engines) {
            try {
              const engine = getEngine(engineName);
              const result = await engine.query(
                prompt,
                monitoring.brandName,
                monitoring.websiteUrl
              );

              enginesData[engineName] = {
                mentioned: result.mentioned,
                cited: result.cited,
                citationUrl: result.citationUrl,
                sentiment: result.sentiment,
                mentions: result.mentions,
                context: result.context,
                response: result.response,
              };

              if (!engineResults[engineName]) {
                engineResults[engineName] = {
                  mentioned: result.mentioned,
                  cited: result.cited,
                  sentiment: result.sentiment,
                  mentions: result.mentions,
                  snippets: result.snippets || [],
                };
              } else {
                engineResults[engineName].mentioned =
                  engineResults[engineName].mentioned || result.mentioned;
                engineResults[engineName].cited =
                  engineResults[engineName].cited || result.cited;
                engineResults[engineName].mentions += result.mentions;
                if (result.snippets) {
                  engineResults[engineName].snippets.push(...result.snippets);
                }
              }
            } catch (engineError) {
              console.error(`Engine ${engineName} error for ${monitoring.brandName}:`, engineError);
              enginesData[engineName] = {
                mentioned: false,
                cited: false,
                error: (engineError as Error).message,
              };
            }
          }

          promptResults.push({
            prompt,
            engines: enginesData,
          });
        }

        const competitors = monitoring.competitors
          ? JSON.parse(JSON.stringify(monitoring.competitors)) as string[]
          : undefined;

        const metrics = MetricsCalculator.calculate(
          engineResults,
          promptResults,
          competitors
        );

        await prisma.gEOCheck.update({
          where: { id: check.id },
          data: {
            status: "completed",
            geoScore: metrics.geoScore,
            shareOfVoice: metrics.shareOfVoice,
            citationRate: metrics.citationRate,
            brandSentiment: metrics.brandSentiment,
            promptCoverage: metrics.promptCoverage,
            snippetFrequency: metrics.snippetFrequency,
            brandAuthority: metrics.brandAuthority,
            zeroClickPresence: metrics.zeroClickPresence,
            engineResults: engineResults as any,
            promptResults: promptResults as any,
          },
        });

        const freqDays = monitoring.frequency === "daily" ? 1 : monitoring.frequency === "monthly" ? 30 : 7;
        const nextCheckAt = new Date();
        nextCheckAt.setDate(nextCheckAt.getDate() + freqDays);

        await prisma.gEOMonitoring.update({
          where: { id: monitoring.id },
          data: { nextCheckAt },
        });

        results.push({ id: monitoring.id, brandName: monitoring.brandName, status: "completed" });
      } catch (checkError) {
        console.error(`Check failed for ${monitoring.brandName}:`, checkError);

        await prisma.gEOMonitoring.update({
          where: { id: monitoring.id },
          data: {
            retryCount: { increment: 1 },
            nextCheckAt: new Date(Date.now() + 3600000),
          },
        });

        results.push({ id: monitoring.id, brandName: monitoring.brandName, status: "failed" });
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("geo-monitoring cron error", error);
    return NextResponse.json(
      { error: "cron_failed" },
      { status: 500 }
    );
  }
}
