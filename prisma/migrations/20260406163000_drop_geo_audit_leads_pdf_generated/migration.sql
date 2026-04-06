-- AlterTable (no DB copy of PDF; flag removed)
ALTER TABLE "geo_audit_leads" DROP COLUMN IF EXISTS "pdfGenerated";
