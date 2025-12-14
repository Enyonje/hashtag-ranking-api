import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface for typing
export interface HashtagMetric extends Document {
  hashtag: string;
  score: number;
  platform: string;
  createdAt: Date;
}

// Mongoose schema for runtime
const HashtagMetricSchema = new Schema<HashtagMetric>(
  {
    hashtag: { type: String, required: true },
    score: { type: Number, required: true },
    platform: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

// Runtime model
export const HashtagMetricModel = mongoose.model<HashtagMetric>(
  'HashtagMetric',
  HashtagMetricSchema
);