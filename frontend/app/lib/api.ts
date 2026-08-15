// Cliente HTTP mínimo hacia el backend Express. Antes vivía duplicado dentro
// de page.tsx; se centraliza aquí porque ahora también lo consume
// useNovedades.ts — una sola definición de API_BASE_URL/apiUrl/fetchJson.
// El frontend nunca ve secretos de Supabase: solo habla con /api/* vía esta
// URL pública (NEXT_PUBLIC_API_BASE_URL).

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(apiUrl(path), { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}
