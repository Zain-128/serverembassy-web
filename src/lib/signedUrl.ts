import crypto from "crypto";

const DEFAULT_SECRET =
  process.env.SIGNED_URL_SECRET ||
  process.env.NEXT_PUBLIC_SIGNED_URL_SECRET ||
  "powerline-enterprise-signed-url-secret-2026-key";

const DEFAULT_EXPIRATION_SECONDS = 86400 * 7; // 7 days

export interface SignUrlOptions {
  expiresInSeconds?: number;
  secret?: string;
  extraParams?: Record<string, string | number | boolean>;
}

export interface VerifyUrlResult {
  valid: boolean;
  expired: boolean;
  error?: string;
  pathname?: string;
  params?: Record<string, string>;
}

function createSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Generates an HMAC-SHA256 signed tamper-proof URL for Powerline Devices
 */
export function generateSignedUrl(
  pathOrUrl: string,
  options: SignUrlOptions = {}
): string {
  const secret = options.secret || DEFAULT_SECRET;
  const expiresIn = options.expiresInSeconds ?? DEFAULT_EXPIRATION_SECONDS;
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  const [basePath, existingQuery] = pathOrUrl.split("?");
  const searchParams = new URLSearchParams(existingQuery || "");

  if (options.extraParams) {
    for (const [key, value] of Object.entries(options.extraParams)) {
      searchParams.set(key, String(value));
    }
  }

  searchParams.set("exp", String(expiresAt));
  searchParams.sort();

  const canonicalPayload = `${basePath}?${searchParams.toString()}`;
  const signature = createSignature(canonicalPayload, secret);
  searchParams.set("sig", signature);

  return `${basePath}?${searchParams.toString()}`;
}

/**
 * Verifies that a signed URL is authentic, untampered, and unexpired
 */
export function verifySignedUrl(
  fullUrlOrPath: string,
  secret: string = DEFAULT_SECRET
): VerifyUrlResult {
  try {
    const [pathname, queryString] = fullUrlOrPath.split("?");
    if (!queryString) {
      return { valid: false, expired: false, error: "Missing signed URL parameters" };
    }

    const searchParams = new URLSearchParams(queryString);
    const providedSig = searchParams.get("sig");
    const expStr = searchParams.get("exp");

    if (!providedSig || !expStr) {
      return { valid: false, expired: false, error: "Missing signature or expiration" };
    }

    const expiresAt = parseInt(expStr, 10);
    if (isNaN(expiresAt)) {
      return { valid: false, expired: false, error: "Invalid expiration format" };
    }

    const now = Math.floor(Date.now() / 1000);
    if (now > expiresAt) {
      return { valid: false, expired: true, error: "Signed URL has expired" };
    }

    searchParams.delete("sig");
    searchParams.sort();
    const canonicalPayload = `${pathname}?${searchParams.toString()}`;

    const expectedSig = createSignature(canonicalPayload, secret);

    const providedBuffer = Buffer.from(providedSig, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");

    if (
      providedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
      return { valid: false, expired: false, error: "Invalid signature: URL tampered" };
    }

    const params: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      params[key] = val;
    });

    return { valid: true, expired: false, pathname, params };
  } catch (err: any) {
    return { valid: false, expired: false, error: err.message || "Verification failed" };
  }
}

/**
 * Creates a signed asset/datasheet download link
 */
export function createSecureDownloadUrl(partNumberOrPath: string, expiresInHours = 24): string {
  return generateSignedUrl(`/api/secure-download`, {
    expiresInSeconds: expiresInHours * 3600,
    extraParams: { item: partNumberOrPath, scope: "specsheet" },
  });
}

/**
 * Creates a signed enterprise order tracking URL
 */
export function createSecureTrackingUrl(orderNumber: string, expiresInDays = 14): string {
  return generateSignedUrl(`/orders/track`, {
    expiresInSeconds: expiresInDays * 86400,
    extraParams: { orderNumber },
  });
}
