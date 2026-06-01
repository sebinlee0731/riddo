import type { TopQuery } from '../types';

interface Props {
  data: TopQuery[];
  loading?: boolean;
}

const MOCK: TopQuery[] = [
  { query: '스프린트 시작 방법이 궁금해요', count: 42 },
  { query: '백로그 항목은 어떻게 관리하나요?', count: 38 },
  { query: 'Jira 연동 오류가 발생합니다', count: 29 },
  { query: '새 프로젝트 생성 권한', count: 21 },
  { query: '초대 링크가 만료되었습니다', count: 15 },
];

export default function TopQueriesList({ data, loading }: Props) {
  const list = data.length > 0 ? data : MOCK;
  const max = Math.max(...list.map((query) => query.count), 1);

  return (
    <div className="bg-white dark:bg-[#1e2235] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a2f45]">
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">FAQ Top 질문</h3>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 bg-gray-100 dark:bg-[#2a2f45] rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((query, index) => (
            <div key={`${query.query}-${index}`} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-4 shrink-0">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-200 truncate pr-2">{query.query}</span>
                  <span className="text-xs text-gray-400 shrink-0">{query.count}건</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#2a2f45] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                    style={{ width: `${(query.count / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
