import type { DocumentSummary } from '../types';

interface DocumentRowProps {
  document: DocumentSummary;
  index: number;
  onClick: () => void;
}

export default function DocumentRow({ document, index, onClick }: DocumentRowProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'indexed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">✅ INDEXED</span>;
      case 'indexing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400">🔄 INDEXING</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400">❌ FAILED</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">⏳ PENDING</span>;
      default:
        return null;
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0" onClick={onClick}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {String(index + 1).padStart(2, '0')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <svg className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{document.title}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          {document.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(document.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 p-2" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
