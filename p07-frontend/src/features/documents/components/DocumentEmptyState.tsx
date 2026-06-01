interface DocumentEmptyStateProps {
  onUploadClick: () => void;
}

export default function DocumentEmptyState({ onUploadClick }: DocumentEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-24 h-24 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">등록된 문서가 없습니다.</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
        새로운 문서를 업로드하여 검색 시스템을 구축해 보세요. PDF, Word, TXT 파일을 지원합니다.
      </p>
      <button
        onClick={onUploadClick}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        문서 업로드 시작하기
      </button>
    </div>
  );
}
