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

    const monitoring = await prisma.gEOMonitoring.findUnique({
      where: { id },
      include: {
        checks: {
          orderBy: { checkDate: "desc" },
          take: 5,
        },
      },
    });

    if (!monitoring) {
      return NextResponse.json(
        { error: "monitoring_not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ monitoring });
  } catch (error) {
    console.error("geo-monitoring get error", error);
    return NextResponse.json(
      { error: "failed_to_get_monitoring" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.gEOMonitoring.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "monitoring_not_found" },
        { status: 404 }
      );
    }

    const monitoring = await prisma.gEOMonitoring.update({
      where: { id },
      data: {
        ...(body.brandName && { brandName: body.brandName }),
        ...(body.websiteUrl && { websiteUrl: body.websiteUrl }),
        ...(body.category && { category: body.category }),
        ...(body.competitors !== undefined && { competitors: body.competitors }),
        ...(body.frequency && { frequency: body.frequency }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.engines && { engines: body.engines }),
      },
    });

    return NextResponse.json({ success: true, monitoring });
  } catch (error) {
    console.error("geo-monitoring update error", error);
    return NextResponse.json(
      { error: "failed_to_update_monitoring" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;

    const existing = await prisma.gEOMonitoring.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "monitoring_not_found" },
        { status: 404 }
      );
    }

    await prisma.gEOMonitoring.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("geo-monitoring delete error", error);
    return NextResponse.json(
      { error: "failed_to_delete_monitoring" },
      { status: 500 }
    );
  }
}
