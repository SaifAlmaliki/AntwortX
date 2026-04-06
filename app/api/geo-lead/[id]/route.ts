import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const lead = await prisma.gEOAuditLead.findUnique({
    where: { id },
    select: { pdfBlob: true, pdfGenerated: true, status: true, company: true, websiteUrl: true },
  });

  if (!lead) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (lead.status !== "completed" || !lead.pdfGenerated) {
    return NextResponse.json({ error: "pdf_not_ready" }, { status: 404 });
  }

  if (!lead.pdfBlob || lead.pdfBlob.length === 0) {
    return NextResponse.json({ error: "pdf_missing" }, { status: 404 });
  }

  const filename = `geo-report-${lead.company || lead.websiteUrl.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;

  return new NextResponse(lead.pdfBlob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": lead.pdfBlob.length.toString(),
    },
  });
}
