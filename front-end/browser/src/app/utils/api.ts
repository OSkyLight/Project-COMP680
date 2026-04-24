const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Resolves a frontend /api/... path to the correct URL.
 *
 * Development (VITE_API_BASE_URL not set):
 *   returns the path as-is so the Vite dev proxy handles it.
 *
 * Production (VITE_API_BASE_URL=https://project-comp680-backend.onrender.com):
 *   strips the /api prefix (which only existed for the proxy) and
 *   prepends the deployed backend URL.
 */
export function apiUrl(path: string): string {
  if (!BASE) return path;
  const backendPath = path.startsWith("/api") ? path.slice(4) : path;
  return `${BASE}${backendPath}`;
}
