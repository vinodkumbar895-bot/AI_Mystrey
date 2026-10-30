import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { guestSession, protectMutationOrigin } from './middleware/session.js';
import { api } from './routes/api.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '32kb' }));
const generationLimiter = rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: Math.min(env.RATE_LIMIT_MAX_REQUESTS, 10), standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, data: null, error: { code: 'RATE_LIMITED', message: 'Too many case generation requests. Please wait and try again.', details: [] } } });
app.use('/api/v1/cases', (req, res, next) => req.method === 'POST' ? generationLimiter(req, res, next) : next());
app.use('/api/v1', guestSession, protectMutationOrigin, api);
app.use(notFound);
app.use(errorHandler);

