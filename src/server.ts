// src/server.ts
import app from './app';
import { connectMongo } from './config/mongo';
import { connectRedis } from './config/redis';

async function start() {
  await connectMongo();
  await connectRedis();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

start().catch((err) => {
  console.error('Startup error', err);
  process.exit(1);
});