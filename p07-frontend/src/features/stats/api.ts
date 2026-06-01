import api from '@/lib/api';
import type { StatsOverview, TopQuery, SatisfactionStats, DailyQueryStat } from './types';

interface Envelope<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

export async function getStatsOverview(period = '7d'): Promise<StatsOverview> {
  const res = await api.get<Envelope<StatsOverview>>(`/admin/stats/overview?period=${period}`);
  return res.data.data;
}

export async function getTopQueries(limit = 5, period = '7d'): Promise<TopQuery[]> {
  const res = await api.get<Envelope<TopQuery[]>>(`/admin/stats/top-queries?limit=${limit}&period=${period}`);
  return res.data.data;
}

export async function getSatisfactionStats(period = '7d'): Promise<SatisfactionStats> {
  const res = await api.get<Envelope<SatisfactionStats>>(`/admin/stats/satisfaction?period=${period}`);
  return res.data.data;
}

export async function getDailyStats(period = '7d'): Promise<DailyQueryStat[]> {
  const res = await api.get<Envelope<DailyQueryStat[]>>(`/admin/stats/daily?period=${period}`);
  return res.data.data;
}