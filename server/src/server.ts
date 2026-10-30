import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env, isProduction } from './config/env.js';

async function start() {
  if (isProduction && env.SESSION_SECRET === 'local-development-secret-change-before-deploy') {
    throw new Error('SESSION_SECRET must be configured with a private production value.');
  }
  if (isProduction && env.MONGODB_URI.startsWith('mongodb://127.0.0.1')) {
    throw new Error('MONGODB_URI must point to the configured production database.');
  }
  if (isProduction && new URL(env.CLIENT_ORIGIN).hostname === 'localhost') {
    throw new Error('CLIENT_ORIGIN must point to the production frontend.');
  }
  try {
    await connectDatabase();
  } catch (error) {
    const type = error instanceof Error ? error.name : 'UnknownError';
    console.error(`MongoDB connection failed (${type}). Start MongoDB or verify MONGODB_URI in server/.env.`);
    process.exit(1);
  }
  app.listen(env.PORT, () => {
    console.info(`AI Mystery Room API listening on port ${env.PORT}.`);
    if (!env.GEMINI_API_KEY) console.warn('Gemini is not configured; case generation is disabled.');
  });
}

start().catch((error: unknown) => {
  console.error('API startup failed. Check MongoDB connectivity and server configuration.');
  if (error instanceof Error && error.message.includes('SESSION_SECRET')) console.error(error.message);
  process.exit(1);
});

