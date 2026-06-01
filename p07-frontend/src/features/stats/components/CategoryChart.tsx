'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryItem } from '../types';
import { useTheme } from '@/components/ThemeProvider';

const MOCK_CATEGORIES: CategoryItem[] = [
  { name: '시작하기', value: 40, color: '#0d9488' },
  { name: '계획', value: 25, color: '#6d28d9' },
  { name: '프로젝트 관리', value: 20, color: '#a78bfa' },
  { name: '연동', value: 15, color: '#d1d5db' },
];

interface Props {
  totalQueries?: number;
}

export default function CategoryChart({ totalQueries = 14 }: Props) {
  const data = MOCK_CATEGORIES;

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
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">카테고리별 분포</h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalQueries}</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-wide">Total</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
              </div>
              <span className="text-gray-500 font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
