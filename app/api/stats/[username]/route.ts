import { fetchPlays } from '@/bgg/fetchPlays';
import { calculateStats } from '@/stats/calculateStats';
import { NextRequest } from 'next/server';

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
  const month = query.get('month');
  const sortBy = query.get('sortBy') || 'plays';

  if (!year) {
    return new Response(`Missing required parameter 'year'`);
  }

  const startDate = !!month ? `${year}-${month}-01` : `${year}-01-01`;
  const endDate = !!month ? `${year}-${month}-31` : `${year}-12-31`;

  const plays = await fetchPlays(username, startDate, endDate);
  const stats = calculateStats({
    plays,
    sortBy,
    username,
  });

  return new Response(JSON.stringify(stats, null, 2));
};
