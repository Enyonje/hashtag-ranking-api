export interface Provider {
  platform: 'tiktok' | 'instagram' | 'x' | 'youtube';
  searchHashtags(keyword: string): Promise<Array<{
    tag: string;
    usageCount: number;
    engagementRate: number;
    velocity: number;
  }>>;
}