import React, { useState } from 'react';
import type { DocumentDetail } from '../types';
import MarkdownEditor, { type MarkdownEditorTab } from './MarkdownEditor';
import {
  useDeleteDocument,
  useReindexDocument,
  useUpdateDocument,
} from '../hooks/useDocumentMutations';
import { DOCUMENT_CATEGORY_OPTIONS } from '../types';

const MAX_FILE_BYTES = 5 * 1024 * 1024;

interface DocumentDetailPanelProps {
  document: DocumentDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onMutated?: () => void;
}

export default function DocumentDetailPanel({ document, isOpen, onClose, onMutated }: DocumentDetailPanelProps) {
  const del = useDeleteDocument();
  const reidx = useReindexDocument();
  const upd = useUpdateDocument();
  const [title, setTitle] = useState(document?.title ?? '');
  const [category, setCategory] = useState(document?.category ?? '');
  const [markdown, setMarkdown] = useState(document?.markdown ?? '');
  const [markdownTab, setMarkdownTab] = useState<MarkdownEditorTab>('preview');
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const categoryOptions = Array.from(
    new Set<string>([
      ...DOCUMENT_CATEGORY_OPTIONS,
      ...(document?.category ? [document.category] : []),
    ]),
  );

  if (!isOpen || !document) return null;

  const handleDelete = async () => {
    if (!window.confirm(`"${document.title}" 문서를 삭제하시겠습니까? 관련 청크와 색인이 함께 삭제됩니다.`)) {
      return;
    }
    try {
      await del.mutate(document.id);
      onMutated?.();
      onClose();
    } catch {
      // hook 에러 표시
    }
  };

  const handleReindex = async () => {
    try {
      await reidx.mutate(document.id);
      onMutated?.();
    } catch {
      // hook 에러 표시
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLocalError(null);
    if (!file) {
      setReplacementFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith('.md')) {
      setLocalError('Markdown(.md) 파일만 교체할 수 있습니다.');
      setReplacementFile(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setLocalError('파일 크기는 5MB 이하여야 합니다.');
      setReplacementFile(null);
      return;
    }
    setReplacementFile(file);
  };

  const handleSave = async () => {
    const nextTitle = title.trim();
    const nextCategory = category.trim();
    const nextMarkdown = markdown;
    if (!nextTitle) {
      setLocalError('문서 제목을 입력하세요.');
      return;
    }
    if (!nextCategory) {
      setLocalError('카테고리를 선택하세요.');
      return;
    }
    if (nextMarkdown !== document.markdown && !nextMarkdown.trim()) {
      setLocalError('Markdown 본문을 입력하세요.');
      return;
    }
    try {
      await upd.mutate(document.id, {
        title: nextTitle !== document.title ? nextTitle : undefined,
        category: nextCategory !== document.category ? nextCategory : undefined,
        markdown: nextMarkdown !== document.markdown ? nextMarkdown : undefined,
        file: replacementFile ?? undefined,
      });
      setReplacementFile(null);
      onMutated?.();
    } catch {
      // hook 에러 표시
    }
  };

  const busy = del.isPending || reidx.isPending || upd.isPending;
  const mutationError = localError ?? del.error ?? reidx.error ?? upd.error;
  const hasChanges =
    title.trim() !== document.title ||
    category.trim() !== document.category ||
    markdown !== document.markdown ||
    replacementFile != null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity" onClick={onClose}></div>
      <section className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-6">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white" id="slide-over-title">
                  문서 상세
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {document.title}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    document.status === 'indexed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' :
                    document.status === 'indexing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400' :
                    document.status === 'pending' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'
                  }`}>
                    {document.status === 'indexed' ? '인덱싱 완료' : document.status}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                  <span className="inline-flex items-center rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {category}
                  </span>
                </div>
              </div>

              <div className="mb-6 space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">문서 제목</label>
                    <input
                      type="text"
                      value={title}
                      disabled={busy}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setLocalError(null);
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">카테고리</label>
                    <select
                      value={category}
                      disabled={busy}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setLocalError(null);
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Markdown 파일 교체</label>
                  <input
                    type="file"
                    accept=".md,text/markdown,text/plain"
                    disabled={busy}
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 dark:file:bg-indigo-900/40 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/60 disabled:opacity-50"
                  />
                  {replacementFile && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{replacementFile.name} 파일로 청크를 교체합니다.</p>
                  )}
                </div>
              </div>

              {document.sourceUrl && (
                <div className="mb-6">
                  <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Document URL</h3>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 text-sm text-gray-500 dark:text-gray-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      readOnly
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400"
                      value={document.sourceUrl}
                    />
                  </div>
                </div>
              )}

              <div className="h-[600px]">
                <MarkdownEditor
                  value={markdown}
                  onChange={(value) => {
                    setMarkdown(value);
                    setLocalError(null);
                  }}
                  activeTab={markdownTab}
                  onTabChange={setMarkdownTab}
                  disabled={busy}
                />
              </div>

              {mutationError && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{mutationError}</p>}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
              <button
                type="button"
                disabled={busy}
                className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                onClick={handleDelete}
              >
                {del.isPending ? '삭제 중' : '삭제'}
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  onClick={onClose}
                >
                  닫기
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  onClick={handleReindex}
                >
                  {reidx.isPending ? '재색인 중' : '재색인'}
                </button>
                <button
                  type="button"
                  disabled={busy || !hasChanges}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleSave}
                >
                  {upd.isPending ? '저장 중' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
