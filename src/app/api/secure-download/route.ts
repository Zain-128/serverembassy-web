import { NextResponse } from "next/server";
import { verifySignedUrl } from "@/lib/signedUrl";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const verification = verifySignedUrl(url.pathname + url.search);

    if (!verification.valid) {
      return NextResponse.json(
        {
          error: "Forbidden: " + (verification.error || "Invalid or expired signed URL"),
          reason: verification.expired ? "URL_EXPIRED" : "INVALID_SIGNATURE",
        },
        { status: 403 }
      );
    }

    const item = verification.params?.item || "datasheet";
    const scope = verification.params?.scope || "document";

    return NextResponse.json({
      authorized: true,
      message: "Signed URL verified successfully",
      download: {
        item,
        scope,
        expiresAt: verification.params?.exp,
        secureToken: verification.params?.sig?.slice(0, 8) + "...",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
