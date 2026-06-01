'use client';

import { useMemo, useState } from 'react';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import {
  useUnansweredQuestions,
  useUpdateUnansweredQuestion,
} from '@/features/unanswered/hooks/useUnansweredQuestions';
import type {
  UnansweredQuestion,
  UnansweredSort,
  UnansweredStatus,
} from '@/features/unanswered/types';

type StatusFilter = UnansweredStatus | 'all';

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: 'unresolved', label: '미처리' },
  { value: 'resolved', label: '해결됨' },
  { value: 'dismissed', label: '보류' },
  { value: 'all', label: '전체' },
];

const statusText: Record<UnansweredStatus, string> = {
  unresolved: '미처리',
  resolved: '해결됨',
  dismissed: '보류',
};

const reasonText: Record<string, string> = {
  out_of_scope: '범위 외 질문',
  no_document: '근거 문서 없음',
};

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function UnansweredPage() {
  const [status, setStatus] = useState<StatusFilter>('unresolved');
  const [sort, setSort] = useState<UnansweredSort>('frequency');
  const [page, setPage] = useState(1);
  const [resolveTarget, setResolveTarget] = useState<UnansweredQuestion | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);

  const params = useMemo(() => ({ page, limit: 10, status, sort }), [page, status, sort]);
  const { data, isLoading, error, refetch } = useUnansweredQuestions(params);
  const update = useUpdateUnansweredQuestion();
  const { data: documents } = useDocuments();

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.limit ?? 10)));

  const handleStatusChange = (next: StatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  const handleSortChange = (next: UnansweredSort) => {
    setSort(next);
    setPage(1);
  };

  const handleDismiss = async (item: UnansweredQuestion) => {
    try {
      await update.mutate(item.id, { status: 'dismissed', resolvedBy: null });
      await refetch();
    } catch {
      // hook 에러 표시
    }
  };

  const handleReopen = async (item: UnansweredQuestion) => {
    try {
      await update.mutate(item.id, { status: 'unresolved', resolvedBy: null });
      await refetch();
    } catch {
      // hook 에러 표시
    }
  };

  const openResolveModal = (item: UnansweredQuestion) => {
    setResolveTarget(item);
    setSelectedDocumentId(item.resolvedBy ?? null);
  };

  const closeResolveModal = () => {
    setResolveTarget(null);
    setSelectedDocumentId(null);
  };

  const handleResolve = async () => {
    if (!resolveTarget || !selectedDocumentId) return;
    try {
      await update.mutate(resolveTarget.id, {
        status: 'resolved',
        resolvedBy: selectedDocumentId,
      });
      closeResolveModal();
      await refetch();
    } catch {
      // hook 에러 표시
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">무응답 질문 관리</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            근거 문서가 없거나 범위를 벗어나 답변하지 못한 질문을 문서와 연결하거나 보류 처리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300" htmlFor="sort">
            정렬
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as UnansweredSort)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-[#2a2f45] dark:bg-[#1e2235] dark:text-gray-100"
          >
            <option value="frequency">빈도순</option>
            <option value="latest">최신순</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleStatusChange(tab.value)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              status === tab.value
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-[#2a2f45] dark:bg-[#1e2235] dark:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-[#2a2f45] dark:bg-[#1e2235]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#2a2f45]">
            <thead className="bg-gray-50 dark:bg-[#171b2f]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">질문</th>
                <th className="w-36 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">사유</th>
                <th className="w-24 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">빈도</th>
                <th className="w-28 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">상태</th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">최근 갱신</th>
                <th className="w-52 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-[#2a2f45] dark:bg-[#1e2235]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-500">불러오는 중입니다.</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-red-600">{error}</td>
                </tr>
              ) : (data?.items.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-500">표시할 질문이 없습니다.</td>
                </tr>
              ) : (
                data?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#171b2f]">
                    <td className="px-6 py-4">
                      <p className="max-w-xl text-sm font-medium text-gray-900 dark:text-white">{item.question}</p>
                      {item.resolvedBy && (
                        <p className="mt-1 text-xs text-gray-500">연결 문서 ID: {item.resolvedBy}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {item.reason ? reasonText[item.reason] ?? item.reason : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{item.frequency}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        item.status === 'dismissed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {statusText[item.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.updatedAt ?? item.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={update.isPending}
                          onClick={() => openResolveModal(item)}
                          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                          해결
                        </button>
                        {item.status === 'dismissed' || item.status === 'resolved' ? (
                          <button
                            type="button"
                            disabled={update.isPending}
                            onClick={() => void handleReopen(item)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-[#2a2f45] dark:bg-[#1e2235] dark:text-gray-200"
                          >
                            재오픈
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={update.isPending}
                            onClick={() => void handleDismiss(item)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-[#2a2f45] dark:bg-[#1e2235] dark:text-gray-200"
                          >
                            보류
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-[#2a2f45]">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            총 <span className="font-semibold">{data?.total ?? 0}</span>건
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-[#2a2f45] dark:bg-[#1e2235] dark:text-gray-200"
            >
              이전
            </button>
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-[#2a2f45] dark:bg-[#1e2235] dark:text-gray-200"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {update.error && <p className="text-sm text-red-600">{update.error}</p>}

      {resolveTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeResolveModal}></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl sm:my-8 sm:align-middle dark:bg-[#1e2235]">
              <div className="px-6 pb-5 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">해결 문서 연결</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{resolveTarget.question}</p>
                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">문서 선택</label>
                  <select
                    value={selectedDocumentId ?? ''}
                    onChange={(e) => setSelectedDocumentId(e.target.value ? Number(e.target.value) : null)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-[#2a2f45] dark:bg-[#171b2f] dark:text-white"
                  >
                    <option value="">문서를 선택하세요</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-[#2a2f45] dark:bg-[#171b2f]">
                <button
                  type="button"
                  disabled={update.isPending}
                  onClick={closeResolveModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-[#2a2f45] dark:bg-[#1e2235] dark:text-gray-200"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={update.isPending || !selectedDocumentId}
                  onClick={() => void handleResolve()}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {update.isPending ? '처리 중' : '해결 처리'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
