'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DailySatisfaction } from '../types';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
  data: DailySatisfaction[];
  changePercent?: number;
}

const MOCK: DailySatisfaction[] = [
  { date: '03/17', thumbUp: 6, thumbDown: 2 },
  { date: '03/18', thumbUp: 8, thumbDown: 1 },
  { date: '03/19', thumbUp: 5, thumbDown: 3 },
  { date: '03/20', thumbUp: 10, thumbDown: 2 },
  { date: '03/21', thumbUp: 9, thumbDown: 1 },
  { date: '오늘', thumbUp: 12, thumbDown: 1 },
];

export default function SatisfactionChart({ data, changePercent = 0 }: Props) {
  const chartData = (data.length > 0 ? data : []).map((item) => ({
    date: item.date,
    만족: item.thumbUp,
    불만족: item.thumbDown,
  }));

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tooltipStyle = {
    background: isDark ? '#1e2235' : '#fff',
    border: `1px solid ${isDark ? '#2a2f45' : '#e5e7eb'}`,
    borderRadius: 8,
    fontSize: 12,
    color: isDark ? '#e5e7eb' : '#111827',
  };

  return (
    <div className="bg-white dark:bg-[#1e2235] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a2f45]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">응답 만족도</h3>
        </div>
        <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
          +{changePercent}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="satisfactionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="만족"
            stroke="#0d9488"
            strokeWidth={2.5}
            fill="url(#satisfactionGrad)"
            dot={{ fill: '#0d9488', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
