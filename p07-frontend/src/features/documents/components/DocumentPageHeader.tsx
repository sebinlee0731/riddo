import React,{useState, useRef, useEffect} from 'react';

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'indexed', label: 'Indexed' },
  { value: 'indexing', label: 'Indexing' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
];

interface DocumentPageHeaderProps {
  totalCount: number;
  onUploadClick: () => void;
  activeFilter: string;
  onFilterChange: (status: string) => void;
  activeCategoryFilter: string;
  categoryOptions: string[];
  onCategoryFilterChange: (category: string) => void;
}

export default function DocumentPageHeader({
  totalCount,
  onUploadClick,
  activeFilter,
  onFilterChange,
  activeCategoryFilter,
  categoryOptions,
  onCategoryFilterChange,
}: DocumentPageHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = STATUS_OPTIONS.find(o => o.value === activeFilter)?.label ?? '필터';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="mb-4 md:mb-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">문서 관리</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          현재 총 {totalCount}건의 문서가 시스템에 등록되어 있습니다.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium bg-white dark:bg-gray-800 transition-colors
              ${activeFilter !== 'all'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-800'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {activeLabel}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors
                    ${activeFilter === option.value
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <select
          value={activeCategoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className={`rounded-md border bg-white px-4 py-2 text-sm font-medium transition-colors dark:bg-gray-800
            ${activeCategoryFilter !== 'all'
              ? 'border-indigo-500 text-indigo-600 ring-2 ring-indigo-200 dark:text-indigo-400 dark:ring-indigo-800'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
        >
          <option value="all">전체 카테고리</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button
          onClick={onUploadClick}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          문서 업로드
        </button>
      </div>
    </div>
  );
}
