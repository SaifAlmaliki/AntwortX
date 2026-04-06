import { NextRequest, NextResponse } from "next/server";

export function withApiAuth(handler: (req: NextRequest, context?: any) => Promise<NextResponse>) {
  return async function (req: NextRequest, context?: any) {
    const apiKey = process.env.GEO_MONITORING_API_KEY;

    if (apiKey) {
      const authHeader = req.headers.get("authorization");
      const providedKey = authHeader?.replace("Bearer ", "");

      if (!providedKey || providedKey !== apiKey) {
        return NextResponse.json(
          { error: "unauthorized" },
          { status: 401 }
        );
      }
    }

    return handler(req, context);
  };
}
