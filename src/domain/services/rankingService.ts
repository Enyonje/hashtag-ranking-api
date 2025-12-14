interface RankHashtagsParams {
  platform: string;
  keyword: string;
  limit: number;
}

export const rankHashtags = async ({
  platform,
  keyword,
  limit
}: RankHashtagsParams) => {
  // ranking logic here
};
