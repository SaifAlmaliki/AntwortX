import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status");
  const grade = searchParams.get("grade");
  const search = searchParams.get("search") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const minScore = searchParams.get("minScore");
  const maxScore = searchParams.get("maxScore");

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (grade) {
    where.grade = grade;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { websiteUrl: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    }
    if (dateTo) {
      (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
    }
  }

  if (minScore || maxScore) {
    where.compositeScore = {};
    if (minScore) {
      (where.compositeScore as Record<string, unknown>).gte = parseFloat(minScore);
    }
    if (maxScore) {
      (where.compositeScore as Record<string, unknown>).lte = parseFloat(maxScore);
    }
  }

  const [leads, total] = await Promise.all([
    prisma.gEOAuditLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.gEOAuditLead.count({ where }),
  ]);

  return NextResponse.json({
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "rerun") {
    const body = await req.json();
    const { id } = body;

    const lead = await prisma.gEOAuditLead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    await prisma.gEOAuditLead.update({
      where: { id },
      data: { status: "pending" },
    });

    return NextResponse.json({ ok: true, message: "Lead queued for re-run" });
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}
