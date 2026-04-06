-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_monitoring" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "brandDNAId" TEXT,
    "brandName" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "competitors" JSONB,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPaidTier" BOOLEAN NOT NULL DEFAULT false,
    "engines" TEXT[],
    "nextCheckAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_monitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_checks" (
    "id" TEXT NOT NULL,
    "monitoringId" TEXT NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "geoScore" DOUBLE PRECISION,
    "shareOfVoice" DOUBLE PRECISION,
    "citationRate" DOUBLE PRECISION,
    "brandSentiment" TEXT,
    "promptCoverage" INTEGER,
    "snippetFrequency" DOUBLE PRECISION,
    "brandAuthority" DOUBLE PRECISION,
    "zeroClickPresence" DOUBLE PRECISION,
    "engineResults" JSONB,
    "promptResults" JSONB,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo_prompt_templates" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "description" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geo_prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "geo_monitoring_userId_idx" ON "geo_monitoring"("userId");

-- CreateIndex
CREATE INDEX "geo_monitoring_isActive_idx" ON "geo_monitoring"("isActive");

-- CreateIndex
CREATE INDEX "geo_monitoring_nextCheckAt_idx" ON "geo_monitoring"("nextCheckAt");

-- CreateIndex
CREATE INDEX "geo_monitoring_brandDNAId_idx" ON "geo_monitoring"("brandDNAId");

-- CreateIndex
CREATE INDEX "geo_checks_monitoringId_idx" ON "geo_checks"("monitoringId");

-- CreateIndex
CREATE INDEX "geo_checks_checkDate_idx" ON "geo_checks"("checkDate");

-- CreateIndex
CREATE INDEX "geo_checks_status_idx" ON "geo_checks"("status");

-- CreateIndex
CREATE INDEX "geo_prompt_templates_category_idx" ON "geo_prompt_templates"("category");

-- CreateIndex
CREATE INDEX "geo_prompt_templates_isActive_idx" ON "geo_prompt_templates"("isActive");

-- AddForeignKey
ALTER TABLE "geo_monitoring" ADD CONSTRAINT "geo_monitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo_checks" ADD CONSTRAINT "geo_checks_monitoringId_fkey" FOREIGN KEY ("monitoringId") REFERENCES "geo_monitoring"("id") ON DELETE CASCADE ON UPDATE CASCADE;
