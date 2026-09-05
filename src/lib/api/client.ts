export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
  const isServer = typeof window === "undefined";
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    ...(isServer ? { next: { revalidate: 0 } } : { cache: "no-store" }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(url: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...init?.headers },
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}
