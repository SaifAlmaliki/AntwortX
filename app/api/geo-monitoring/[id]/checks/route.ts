import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const checks = await prisma.gEOCheck.findMany({
      where: { monitoringId: id },
      orderBy: { checkDate: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.gEOCheck.count({
      where: { monitoringId: id },
    });

    return NextResponse.json({ checks, total, limit, offset });
  } catch (error) {
    console.error("geo-monitoring checks error", error);
    return NextResponse.json(
      { error: "failed_to_get_checks" },
      { status: 500 }
    );
  }
}
