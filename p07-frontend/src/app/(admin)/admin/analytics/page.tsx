'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import PeriodTabs from '@/features/stats/components/PeriodTabs';
import StatCard from '@/features/stats/components/StatCard';
import TopQueriesList from '@/features/stats/components/TopQueriesList';
import { useSatisfactionStats, useStatsOverview, useTopQueries, useDailyStats } from '@/features/stats/hooks/useStats';
import type { StatsPeriod } from '@/features/stats/types';

const CategoryChart = dynamic(() => import('@/features/stats/components/CategoryChart'), { ssr: false });
const DailyQueriesChart = dynamic(() => import('@/features/stats/components/DailyQueriesChart'), { ssr: false });
const SatisfactionChart = dynamic(() => import('@/features/stats/components/SatisfactionChart'), { ssr: false });

function IconMessage() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconThumb() {
  return (
    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
      />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatPercentParts(value: number) {
  const fixed = value.toFixed(1);
  const [integer, decimal = '0'] = fixed.split('.');
  return { integer: Number(integer), decimal: `.${decimal}` };
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<StatsPeriod>('7d');

  const { data: overview, loading: overviewLoading } = useStatsOverview(period);
  const { data: topQueries, loading: topQueriesLoading } = useTopQueries(period);
  const { data: satisfaction } = useSatisfactionStats(period);
  const { data: dailyStats, loading: dailyLoading } = useDailyStats(period);

  const totalQuestions = overview?.totalQuestions ?? 0;
  const unanswered = overview?.totalUnanswered ?? 0;
  const successRate = totalQuestions > 0 ? ((totalQuestions - unanswered) / totalQuestions) * 100 : 0;
  const failRate = totalQuestions > 0 ? (unanswered / totalQuestions) * 100 : 0;
  const satisfactionRate = overview?.satisfactionRate ?? 0;
  const successParts = formatPercentParts(successRate);
  const failParts = formatPercentParts(failRate);
  const satisfactionParts = formatPercentParts(satisfactionRate);
  const daily = satisfaction?.daily ?? [];
  const changePercent = (() => {
    if (daily.length < 2) return 0;
    const prev = daily[daily.length - 2];
    const curr = daily[daily.length - 1];
    const prevRate = prev.thumbUp + prev.thumbDown > 0
      ? (prev.thumbUp / (prev.thumbUp + prev.thumbDown)) * 100 : 0;
    const currRate = curr.thumbUp + curr.thumbDown > 0
      ? (curr.thumbUp / (curr.thumbUp + curr.thumbDown)) * 100 : 0;
    return Math.round((currRate - prevRate) * 10) / 10;
  })();

  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 0));
  const periodLabel =
    period === 'today' ? formatDate(today) : period === 'all' ? '전체 기간' : `${formatDate(from)} ~ ${formatDate(today)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">통계</h1>
          <PeriodTabs value={period} onChange={setPeriod} />
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 border border-gray-200 dark:border-[#2a2f45] rounded-lg px-3 py-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {periodLabel}
          </div>
        </div>
      </div>

      {overviewLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-100 dark:bg-[#1e2235] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="총 질문 수" value={totalQuestions} icon={<IconMessage />} />
          <StatCard label="응답 성공률" value={successParts.integer} subValue={successParts.decimal} unit="%" icon={<IconCheck />} />
          <StatCard label="사용자 만족도" value={satisfactionParts.integer} subValue={satisfactionParts.decimal} unit="%" icon={<IconThumb />} />
          <StatCard label="실패율" value={failParts.integer} subValue={failParts.decimal} unit="%" icon={<IconAlert />} accent="red" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DailyQueriesChart 
          totalQuestions={totalQuestions}
          data = {dailyStats}
          loading = {dailyLoading} />
        <SatisfactionChart data={satisfaction?.daily ?? []} changePercent={changePercent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopQueriesList data={topQueries} loading={topQueriesLoading} />
        <CategoryChart totalQueries={overview?.totalIndexedDocs ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e2235] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a2f45]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">인사이트 요약</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            최근 질문과 무응답 비율을 기준으로 보강이 필요한 문서 영역을 확인할 수 있습니다. 반복 질문은 FAQ 후보로 검토하세요.
          </p>
          <button className="text-xs text-purple-500 hover:text-purple-600 font-medium">개선 제안 상세 보기</button>
        </div>

        <div className="bg-white dark:bg-[#1e2235] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a2f45]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">사용자 활동량</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            기간별 질문량과 응답 실패율을 함께 보면서 운영 시간대와 문서 보강 우선순위를 판단할 수 있습니다.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1e2235] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a2f45] flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-gray-900 dark:text-white leading-none">
            {overview?.satisfactionRate != null ? `${Math.round(overview.satisfactionRate)}%` : '-'}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Human-Free Interaction</span>
          <span className="text-xs text-gray-400 mt-1">자동 처리된 질문 비율</span>
        </div>
      </div>
    </div>
  );
}
