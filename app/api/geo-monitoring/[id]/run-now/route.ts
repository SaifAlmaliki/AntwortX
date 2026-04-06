import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PromptGenerator } from "@/lib/geo-engines/prompt-generator";
import { getEngine } from "@/lib/geo-engines";
import { MetricsCalculator } from "@/lib/geo-metrics/calculator";

export const runtime = "nodejs";

async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const apiKey = process.env.GEO_MONITORING_API_KEY;
  if (!apiKey) return null;
  const authHeader = req.headers.get("authorization");
  const providedKey = authHeader?.replace("Bearer ", "");
  if (!providedKey || providedKey !== apiKey) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;

    const monitoring = await prisma.gEOMonitoring.findUnique({
      where: { id },
    });

    if (!monitoring) {
      return NextResponse.json(
        { error: "monitoring_not_found" },
        { status: 404 }
      );
    }

    const check = await prisma.gEOCheck.create({
      data: {
        monitoringId: id,
        status: "running",
      },
    });

    try {
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
            console.error(`Engine ${engineName} error:`, engineError);
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
        where: { id },
        data: { nextCheckAt },
      });

      return NextResponse.json({ success: true, checkId: check.id, metrics });
    } catch (checkError) {
      await prisma.gEOCheck.update({
        where: { id: check.id },
        data: {
          status: "failed",
          errorMessage: (checkError as Error).message,
        },
      });

      throw checkError;
    }
  } catch (error) {
    console.error("geo-monitoring run-now error", error);
    return NextResponse.json(
      { error: "failed_to_run_check" },
      { status: 500 }
    );
  }
}
