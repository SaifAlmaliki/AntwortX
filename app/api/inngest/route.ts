import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { geoAnalysisFunction } from "@/lib/inngest/geo-function";

export const runtime = "nodejs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [geoAnalysisFunction],
});
