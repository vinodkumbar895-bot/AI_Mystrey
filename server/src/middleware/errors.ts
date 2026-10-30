import type { ErrorRequestHandler, RequestHandler } from 'express';

export class HttpError extends Error {
  constructor(readonly status: number, readonly code: string, message: string, readonly details?: unknown[]) { super(message); }
}

export const asyncRoute = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const notFound: RequestHandler = (_req, _res, next) => next(new HttpError(404, 'NOT_FOUND', 'The requested resource was not found.'));

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  const value = error as { status?: number; code?: string; message?: string; details?: unknown[] };
  const status = Number.isInteger(value.status) ? value.status! : 500;
  const code = value.code ?? (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  const message = status >= 500 && !['AI_NOT_CONFIGURED', 'GENERATION_FAILED'].includes(code)
    ? 'Something went wrong. Please try again.' : value.message ?? 'The request could not be completed.';
  if (status >= 500 && code === 'INTERNAL_ERROR') console.error('Request failed with an internal error.');
  res.status(status).json({ success: false, data: null, error: { code, message, details: value.details ?? [] } });
};

