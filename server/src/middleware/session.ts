import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { env, isProduction } from '../config/env.js';

declare global { namespace Express { interface Request { guestSessionId: string } } }

function sign(value: string) { return createHmac('sha256', env.SESSION_SECRET).update(value).digest('base64url'); }
function validCookie(cookie: string | undefined): string | null {
  if (!cookie) return null;
  const [sessionId, issuedAtText, signature] = cookie.split('.');
  const issuedAt = Number(issuedAtText);
  if (!sessionId || !issuedAtText || !signature || !/^[a-f0-9]{64}$/.test(sessionId) || !Number.isSafeInteger(issuedAt)) return null;
  if (issuedAt > Date.now() || Date.now() - issuedAt > 30 * 24 * 60 * 60 * 1000) return null;
  const expected = Buffer.from(sign(`${sessionId}.${issuedAtText}`)); const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected) ? sessionId : null;
}

export function guestSession(req: Request, res: Response, next: NextFunction) {
  const cookies = req.headers.cookie?.split(';').map((entry) => entry.trim()) ?? [];
  const raw = cookies.find((entry) => entry.startsWith('amr_session='))?.slice('amr_session='.length);
  const sessionId = validCookie(raw) ?? randomBytes(32).toString('hex');
  req.guestSessionId = sessionId;
  if (!validCookie(raw)) {
    const issuedAt = String(Date.now());
    const attributes = [`amr_session=${sessionId}.${issuedAt}.${sign(`${sessionId}.${issuedAt}`)}`, 'Path=/', 'HttpOnly', `SameSite=${isProduction ? 'None' : 'Lax'}`, 'Max-Age=2592000'];
    if (isProduction) attributes.push('Secure');
    res.append('Set-Cookie', attributes.join('; '));
  }
  next();
}

export function protectMutationOrigin(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('origin') !== env.CLIENT_ORIGIN) return res.status(403).json({ success: false, data: null, error: { code: 'ORIGIN_REJECTED', message: 'This request origin is not allowed.', details: [] } });
  next();
}

