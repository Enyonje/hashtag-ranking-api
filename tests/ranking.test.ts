import request from 'supertest';
import app from '../src/app';
import { redis } from '../src/config/redis';
import mongoose from 'mongoose';

describe('Hashtag Ranking API', () => {
  it('returns ranked hashtags when valid API key and query are provided', async () => {
    const res = await request(app)
      .get('/v1/hashtags/rank?platform=instagram&keyword=fitness&limit=5')
      .set('x-api-key', 'your-dev-key-1');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.hashtags)).toBe(true);
    expect(res.body.hashtags.length).toBe(5);
  });

  it('rejects request with missing API key', async () => {
    const res = await request(app)
      .get('/v1/hashtags/rank?platform=instagram&keyword=fitness&limit=5');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects request with invalid API key', async () => {
    const res = await request(app)
      .get('/v1/hashtags/rank?platform=instagram&keyword=fitness&limit=5')
      .set('x-api-key', 'wrong-key');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('handles missing query parameters gracefully', async () => {
    const res = await request(app)
      .get('/v1/hashtags/rank')
      .set('x-api-key', 'your-dev-key-1');

    // Depending on your implementation, this might be 400 Bad Request
    expect([400, 422]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });

  it('returns correct number of hashtags when limit is 10', async () => {
    const res = await request(app)
      .get('/v1/hashtags/rank?platform=instagram&keyword=fitness&limit=10')
      .set('x-api-key', 'your-dev-key-1');

    expect(res.status).toBe(200);
    expect(res.body.hashtags.length).toBe(10);
  });
});

// Close Redis and MongoDB connections after all tests
afterAll(async () => {
  try { await redis.quit(); } catch {}
  try { await mongoose.connection.close(); } catch {}
});