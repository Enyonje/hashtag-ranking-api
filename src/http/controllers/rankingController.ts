import { Request, Response } from 'express';
import { rankHashtags } from '../../domain/services/rankingService';

export const rankingController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { platform, keyword, limit } = req.query;

  const data = await rankHashtags({
    platform: platform as string,
    keyword: keyword as string,
    limit: Number(limit)
  });

  res.status(200).json({
    success: true,
    data
  });
};
