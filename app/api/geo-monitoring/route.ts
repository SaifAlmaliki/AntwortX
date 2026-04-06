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

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const {
      brandName,
      websiteUrl,
      category,
      competitors,
      frequency,
      engines,
    } = body;

    if (!brandName || !websiteUrl || !category) {
      return NextResponse.json(
        { error: "brandName, websiteUrl, and category are required" },
        { status: 400 }
      );
    }

    const validFrequencies = ["daily", "weekly", "monthly"];
    const freq = frequency || "weekly";
    if (!validFrequencies.includes(freq)) {
      return NextResponse.json(
        { error: "frequency must be daily, weekly, or monthly" },
        { status: 400 }
      );
    }

    const validEngines = ["openai", "perplexity", "gemini", "claude"];
    const engineList = engines || ["openai"];
    if (!Array.isArray(engineList) || !engineList.every((e: string) => validEngines.includes(e))) {
      return NextResponse.json(
        { error: "engines must be an array of: openai, perplexity, gemini, claude" },
        { status: 400 }
      );
    }

    const nextCheckAt = new Date();
    if (freq === "weekly") nextCheckAt.setDate(nextCheckAt.getDate() + 7);
    else if (freq === "monthly") nextCheckAt.setMonth(nextCheckAt.getMonth() + 1);
    else nextCheckAt.setDate(nextCheckAt.getDate() + 1);

    const monitoring = await prisma.gEOMonitoring.create({
      data: {
        brandName,
        websiteUrl,
        category,
        competitors: competitors ? JSON.parse(JSON.stringify(competitors)) : null,
        frequency: freq,
        engines: engineList,
        nextCheckAt,
      },
    });

    return NextResponse.json({ success: true, monitoring }, { status: 201 });
  } catch (error) {
    console.error("geo-monitoring create error", error);
    return NextResponse.json(
      { error: "failed_to_create_monitoring" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const monitoring = await prisma.gEOMonitoring.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        checks: {
          orderBy: { checkDate: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ monitoring });
  } catch (error) {
    console.error("geo-monitoring list error", error);
    return NextResponse.json(
      { error: "failed_to_list_monitoring" },
      { status: 500 }
    );
  }
}
