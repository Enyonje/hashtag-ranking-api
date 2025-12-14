import { HashtagMetricModel, HashtagMetric } from '../models/HashtagMetric';

export class HashtagRepository {
  async create(metric: Omit<HashtagMetric, keyof Document>): Promise<HashtagMetric> {
    const doc = new HashtagMetricModel(metric);
    return await doc.save();
  }

  async findByPlatform(platform: string, limit = 10): Promise<HashtagMetric[]> {
    return await HashtagMetricModel.find({ platform })
      .sort({ score: -1 })
      .limit(limit)
      .exec();
  }

  async findOne(hashtag: string, platform: string): Promise<HashtagMetric | null> {
    return await HashtagMetricModel.findOne({ hashtag, platform }).exec();
  }
}