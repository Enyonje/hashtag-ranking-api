import { Router } from 'express';
import { HashtagRepository } from '../../domain/repositories/hashtagRepo';

export const rankingRouter = Router();
const repo = new HashtagRepository();

rankingRouter.get('/rank', async (req, res) => {
  const { platform, keyword, limit } = req.query;

  if (!platform || !keyword) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const results = await repo.findByPlatform(String(platform), Number(limit) || 5);

    // If no DB results, return dummy hashtags for now
    if (!results || results.length === 0) {
      const n = Number(limit) || 5;
      return res.status(200).json({
        hashtags: Array.from({ length: n }, (_, i) => `${String(keyword)}${i + 1}`),
        platform
      });
    }

    return res.status(200).json({ hashtags: results, platform });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: String(err) });
  }
});