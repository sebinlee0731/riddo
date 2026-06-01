import type { DocumentSummary } from '../types';
import DocumentRow from './DocumentRow';
import DocumentEmptyState from './DocumentEmptyState';

interface DocumentTableProps {
  documents: DocumentSummary[];
  onUploadClick: () => void;
  onRowClick: (doc: DocumentSummary) => void;
}

export default function DocumentTable({ documents, onUploadClick, onRowClick }: DocumentTableProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <DocumentEmptyState onUploadClick={onUploadClick} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                숫자
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                제목
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">
                카테고리
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">
                상태
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc, index) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                index={index}
                onClick={() => onRowClick(doc)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{documents.length}</span> of{' '}
            <span className="font-medium">{documents.length}</span> results
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            이전
          </button>
          <div className="hidden sm:flex space-x-1 mx-2">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">
              1
            </button>
          </div>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
