const API_ROOT = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';
interface Envelope<T> { success: boolean; data: T; error: null | { code: string; message: string; details?: { field?: string; message: string }[] } }

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000);
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      ...options, credentials: 'include', signal: controller.signal, headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  } catch (reason) {
    if (reason instanceof Error && reason.name === 'AbortError') throw new Error('This request took too long. Please try again.');
    throw new Error('Unable to reach the investigation desk. Check that the API is running and try again.');
  } finally { clearTimeout(timeout); }
  const body = await response.json().catch(() => null) as Envelope<T> | null;
  if (!response.ok || !body?.success) throw new Error(body?.error?.message ?? 'The request could not be completed.');
  return body.data;
}

