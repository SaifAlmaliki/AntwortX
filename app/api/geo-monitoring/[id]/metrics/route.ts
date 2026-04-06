import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const metric = searchParams.get("metric");

    const where: any = { monitoringId: id, status: "completed" };
    if (startDate) where.checkDate = { ...where.checkDate, gte: new Date(startDate) };
    if (endDate) where.checkDate = { ...where.checkDate, lte: new Date(endDate) };

    const checks = await prisma.gEOCheck.findMany({
      where,
      orderBy: { checkDate: "asc" },
    });

    const metrics: Record<string, Array<{ date: string; value: number | null }>> = {};

    const metricFields = [
      "geoScore",
      "shareOfVoice",
      "citationRate",
      "brandAuthority",
      "zeroClickPresence",
      "snippetFrequency",
    ];

    const fieldsToReturn = metric ? [metric] : metricFields;

    for (const field of fieldsToReturn) {
      metrics[field] = checks.map((check: { checkDate: Date; [key: string]: unknown }) => ({
        date: format(check.checkDate, "yyyy-MM-dd"),
        value: check[field] as number | null,
      }));
    }

    if (metric && !metrics[metric]) {
      return NextResponse.json(
        { error: "invalid_metric" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      metrics: metric ? metrics[metric] : metrics,
      sentiment: checks.map((check: { checkDate: Date; brandSentiment: string | null }) => ({
        date: format(check.checkDate, "yyyy-MM-dd"),
        value: check.brandSentiment,
      })),
      promptCoverage: checks.map((check: { checkDate: Date; promptCoverage: number | null }) => ({
        date: format(check.checkDate, "yyyy-MM-dd"),
        value: check.promptCoverage,
      })),
    });
  } catch (error) {
    console.error("geo-monitoring metrics error", error);
    return NextResponse.json(
      { error: "failed_to_get_metrics" },
      { status: 500 }
    );
  }
}
