import { NextRequest } from 'next/server';

import { getStatsForUsername } from '@/stats/getStatsForUsername';

interface RouteParams {
  username: string;
}

export const GET = async (
  request: NextRequest,
  { params }: { params: RouteParams }
) => {
  const { username } = params;

  const query = request.nextUrl.searchParams;
  const year = query.get('year');
  const month = query.get('month') || undefined;
  const sortBy = query.get('sortBy') || 'plays';
  const includeExpansions = query.get('includeExpansions') === 'true';

  if (!year) {
    return new Response(`Missing required parameter 'year'`);
  }

  const stats = await getStatsForUsername({
    username,
    year,
    month,
    sortBy,
    includeExpansions,
  });

  return new Response(JSON.stringify(stats, null, 2));
};
