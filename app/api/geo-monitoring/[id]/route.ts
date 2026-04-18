import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshPositioningAndPrompts } from "@/lib/geo/monitoring-prompts";
import {
  mergeInboundPositioning,
  mergePositioningPartial,
  minimalPositioningFromCategory,
  parsePositioningJson,
  type PositioningProfile,
} from "@/lib/geo/positioning-types";

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

    const urlChanged =
      typeof body.websiteUrl === "string" &&
      body.websiteUrl.length > 0 &&
      body.websiteUrl !== existing.websiteUrl;

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

    const categoryChanged =
      typeof body.category === "string" &&
      body.category.length > 0 &&
      body.category !== existing.category;

    const shouldRefreshPrompts =
      body.regeneratePrompts === true ||
      urlChanged ||
      body.positioning !== undefined ||
      categoryChanged;

    if (shouldRefreshPrompts) {
      const hasPositioningBody =
        body.positioning !== undefined && typeof body.positioning === "object";

      // URL change must re-crawl the new site first; optional body.positioning is merged on top of extraction, not on stale DB positioning.
      if (urlChanged && hasPositioningBody) {
        await refreshPositioningAndPrompts(id, {
          websiteUrl: monitoring.websiteUrl,
          reExtractWebsite: true,
          positioningOverride: body.positioning as Partial<PositioningProfile>,
        });
      } else if (urlChanged) {
        await refreshPositioningAndPrompts(id, {
          websiteUrl: monitoring.websiteUrl,
          reExtractWebsite: true,
        });
      } else if (hasPositioningBody) {
        let baseProfile =
          parsePositioningJson(existing.positioning) ??
          minimalPositioningFromCategory(monitoring.category, monitoring.brandName);
        if (categoryChanged) {
          baseProfile = mergePositioningPartial(baseProfile, {
            category: monitoring.category,
          });
        }
        const merged = mergeInboundPositioning(baseProfile, body.positioning);
        await refreshPositioningAndPrompts(id, {
          websiteUrl: monitoring.websiteUrl,
          reExtractWebsite: false,
          explicitProfile: merged,
        });
      } else if (categoryChanged) {
        await refreshPositioningAndPrompts(id, {
          websiteUrl: monitoring.websiteUrl,
          reExtractWebsite: false,
          positioningOverride: { category: monitoring.category },
        });
      } else if (body.regeneratePrompts === true) {
        await refreshPositioningAndPrompts(id, {
          websiteUrl: monitoring.websiteUrl,
          reExtractWebsite: false,
        });
      }

      const refreshed = await prisma.gEOMonitoring.findUnique({ where: { id } });
      return NextResponse.json({ success: true, monitoring: refreshed ?? monitoring });
    }

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
