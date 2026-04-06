-- AlterTable (PDFs are emailed only; drop legacy binary column if present)
ALTER TABLE "geo_audit_leads" DROP COLUMN IF EXISTS "pdfBlob";
