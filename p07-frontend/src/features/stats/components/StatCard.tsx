interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon: React.ReactNode;
  accent?: 'default' | 'red';
}

export default function StatCard({ label, value, unit, subValue, icon, accent = 'default' }: StatCardProps) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-[#1e2235] rounded-2xl px-6 py-5 shadow-sm border border-gray-100 dark:border-[#2a2f45]">
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${accent === 'red' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </span>
          {subValue && (
            <span className={`text-lg font-bold ${accent === 'red' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
              {subValue}
            </span>
          )}
          {unit && (
            <span className="text-sm text-gray-400 ml-0.5">{unit}</span>
          )}
        </div>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        accent === 'red'
          ? 'bg-red-50 dark:bg-red-900/20 text-red-400'
          : 'bg-gray-50 dark:bg-[#2a2f45] text-gray-400'
      }`}>
        {icon}
      </div>
    </div>
  );
}
