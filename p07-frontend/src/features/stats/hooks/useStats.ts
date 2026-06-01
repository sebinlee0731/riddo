'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSatisfactionStats, getStatsOverview, getTopQueries, getDailyStats } from '../api';
import type { SatisfactionStats, StatsOverview, StatsPeriod, TopQuery, DailyQueryStat } from '../types';

const LOAD_ERROR_MESSAGE = '데이터를 불러오지 못했습니다.';

export function useStatsOverview(period: StatsPeriod = '7d') {
  const [data, setData] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setData(await getStatsOverview(period));
    } catch {
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    let alive = true;

    getStatsOverview(period)
      .then((overview) => {
        if (!alive) return;
        setData(overview);
        setError(null);
      })
      .catch(() => {
        if (!alive) return;
        setError(LOAD_ERROR_MESSAGE);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [period]);

  return { data, loading, error, refetch };
}

export function useTopQueries(period: StatsPeriod = '7d') {
  const [data, setData] = useState<TopQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    getTopQueries(5, period)
      .then((queries) => {
        if (!alive) return;
        setData(queries);
      })
      .catch(() => {
        if (!alive) return;
        setData([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [period]);

  return { data, loading };
}

export function useSatisfactionStats(period: StatsPeriod) {
  const [data, setData] = useState<SatisfactionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    getSatisfactionStats(period)
      .then((stats) => {
        if (!alive) return;
        setData(stats);
      })
      .catch(() => {
        if (!alive) return;
        setData(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [period]);

  return { data, loading };
}

export function useDailyStats(period: StatsPeriod = '7d') {
  const [data, setData] = useState<DailyQueryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getDailyStats(period)
      .then(d => { if (alive) setData(d); })
      .catch(() => { if (alive) setData([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [period]);

  return { data, loading };
}