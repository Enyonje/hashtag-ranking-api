
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { apiKeyAuth } from './http/middleware/apiKeyAuth';
import { rankingRouter } from './http/routes/ranking';
import openapiRouter from './http/docs/openapi';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Keep logging minimal in tests
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Auth middleware first
app.use(apiKeyAuth);

// Mount docs only outside tests (Swagger can be surprisingly heavy)
if (process.env.NODE_ENV !== 'test') {
  app.use(openapiRouter);
}

app.use('/v1/hashtags', rankingRouter);

export default app;