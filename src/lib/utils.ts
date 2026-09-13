import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeText(text?: string | null) {
  if (typeof text !== "string") return "";
  return text.replace(/\0/g, "");
}

/**
 * Generic SWR fetcher — resolves to JSON, throws on non-OK responses.
 */
export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(
      `Request failed: ${res.status} ${res.statusText}`,
    ) as Error & { status: number };
    error.status = res.status;
    throw error;
  }
  return res.json() as Promise<T>;
}

/**
 * Wrapper around fetch that surfaces structured error info from JSON error bodies.
 */
export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.clone().json();
      if (body?.error) message = body.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return res;
}

/**
 * Generates a UUID v4 string.
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
