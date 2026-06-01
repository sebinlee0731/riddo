import type { StatsPeriod } from '../types';

const TABS: { label: string; value: StatsPeriod }[] = [
  { label: '오늘', value: 'today' },
  { label: '7일', value: '7d' },
  { label: '30일', value: '30d' },
  { label: '전체', value: 'all' },
];

interface Props {
  value: StatsPeriod;
  onChange: (period: StatsPeriod) => void;
}

export default function PeriodTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value === tab.value
              ? 'bg-[#6d28d9] text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
