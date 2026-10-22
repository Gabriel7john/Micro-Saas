const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export interface Product { id: string; name: string; description?: string | null; priceCents: number; imageUrl?: string | null; active: boolean }
export interface Store { id: string; slug: string; name: string; whatsapp: string; products: Product[] }
export interface Me { email: string; plan: string; freeLimit: number; store: Store }

export const getToken = () => localStorage.getItem("token");
export const setToken = (t: string | null) => (t ? localStorage.setItem("token", t) : localStorage.removeItem("token"));

export async function api<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    method: opts.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Não foi possível completar a ação.");
  return data as T;
}

export const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const toCents = (v: string) => Math.round(parseFloat(v.replace(/\./g, "").replace(",", ".")) * 100) || 0;
