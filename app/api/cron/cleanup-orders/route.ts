import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredOrders } from "@/lib/actions/cron.action";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");

  const expectedSecret = process.env.CRON_SECRET;

  // In production, or if CRON_SECRET is defined, enforce security validation
  if (process.env.NODE_ENV === "production" || expectedSecret) {
    const isAuthorized =
      authHeader === `Bearer ${expectedSecret}` ||
      (token && token === expectedSecret);

    if (!isAuthorized) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const result = await cleanupExpiredOrders();

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 500 });
  }
}
