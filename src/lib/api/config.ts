export function getApiUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
}

export function storeApi(path: string) {
  return `${getApiUrl()}/api/store${path}`;
}

export function publicApi(path: string) {
  return `${getApiUrl()}/api${path}`;
}
