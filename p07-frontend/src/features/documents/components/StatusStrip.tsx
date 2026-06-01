import React from 'react';

interface StatusCounts {
  total: number;
  indexed: number;
  indexing: number;
  failed: number;
}

interface StatusStripProps {
  counts: StatusCounts;
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

export default function StatusStrip({ counts, activeFilter, onFilterChange }: StatusStripProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Total Card */}
      <div
        onClick={() => onFilterChange('all')}
        className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-5 flex flex-col justify-between cursor-pointer transition-colors
          ${activeFilter === 'all' ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
      >
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">전체 문서</div>
        <div className="flex items-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{counts.total}</span>
          <svg className="w-5 h-5 ml-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* Indexed Card */}
      <div
        onClick={() => onFilterChange('indexed')}
        className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-5 flex flex-col justify-between cursor-pointer transition-colors
          ${activeFilter === 'indexed' ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
      >
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">✅ INDEXED</div>
        <div className="flex items-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{counts.indexed}</span>
          <svg className="w-5 h-5 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Indexing Card */}
      <div
        onClick={() => onFilterChange('indexing')}
        className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-5 flex flex-col justify-between cursor-pointer transition-colors
          ${activeFilter === 'indexing' ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
      >
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">🔄 INDEXING</div>
        <div className="flex items-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{counts.indexing}</span>
          <svg className="w-5 h-5 ml-2 text-blue-500 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      {/* Failed Card */}
      <div
        onClick={() => onFilterChange('failed')}
        className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-5 flex flex-col justify-between cursor-pointer transition-colors
          ${activeFilter === 'failed' ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
      >
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">❌ FAILED</div>
        <div className="flex items-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{counts.failed}</span>
          <svg className="w-5 h-5 ml-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
  );
}
