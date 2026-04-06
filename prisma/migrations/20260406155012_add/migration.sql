-- CreateTable
CREATE TABLE "geo_audit_leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "company" TEXT,
    "city" TEXT,
    "compositeScore" DOUBLE PRECISION,
    "grade" TEXT,
    "llmResults" JSONB,
    "promptResults" JSONB,
    "websiteData" JSONB,
    "agentResults" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "pdfGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_audit_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "geo_audit_leads_email_idx" ON "geo_audit_leads"("email");

-- CreateIndex
CREATE INDEX "geo_audit_leads_websiteUrl_idx" ON "geo_audit_leads"("websiteUrl");

-- CreateIndex
CREATE INDEX "geo_audit_leads_status_idx" ON "geo_audit_leads"("status");
