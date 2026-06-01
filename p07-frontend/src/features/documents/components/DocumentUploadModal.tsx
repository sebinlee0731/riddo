import React, { useMemo, useRef, useState } from 'react';
import { uploadDocument } from '../api';
import { DOCUMENT_CATEGORY_OPTIONS } from '../types';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const CUSTOM_CATEGORY_VALUE = '__custom__';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

export default function DocumentUploadModal({ isOpen, onClose, onUploaded }: DocumentUploadModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCategory = useMemo(
    () => (category === CUSTOM_CATEGORY_VALUE ? customCategory.trim() : category.trim()),
    [category, customCategory],
  );

  const canSubmit = Boolean(file && selectedCategory && !isProcessing);

  if (!isOpen) return null;

  const reset = () => {
    setTitle('');
    setCategory('');
    setCustomCategory('');
    setUrl('');
    setFile(null);
    setLocalError(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (isProcessing) return;
    reset();
    onClose();
  };

  const validateFile = (nextFile: File | null) => {
    setLocalError(null);
    if (!nextFile) {
      setFile(null);
      return;
    }
    if (!nextFile.name.toLowerCase().endsWith('.md')) {
      setLocalError('Markdown(.md) 파일만 업로드 가능합니다.');
      setFile(null);
      return;
    }
    if (nextFile.size > MAX_FILE_BYTES) {
      setLocalError('파일 크기는 5MB 이하여야 합니다.');
      setFile(null);
      return;
    }
    setFile(nextFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateFile(e.target.files?.[0] ?? null);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    validateFile(e.dataTransfer.files?.[0] ?? null);
  };

  const validateSourceUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:' || parsed.hostname !== 'docs.riido.io') {
        return '원본 URL은 https://docs.riido.io/ 링크만 입력할 수 있습니다.';
      }
    } catch {
      return '원본 URL 형식을 확인하세요.';
    }

    return undefined;
  };

  const handleSubmit = async () => {
    if (!file) {
      setLocalError('업로드할 Markdown 파일을 선택하세요.');
      return;
    }
    if (!selectedCategory) {
      setLocalError('카테고리를 선택하거나 직접 입력하세요.');
      return;
    }

    const urlError = validateSourceUrl(url);
    if (urlError) {
      setLocalError(urlError);
      return;
    }

    setIsProcessing(true);
    setLocalError(null);
    try {
      await uploadDocument({
        file,
        category: selectedCategory,
        title: title.trim() || undefined,
        url: url.trim() || undefined,
      });
      onUploaded?.();
      reset();
      onClose();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '문서 업로드 실패');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-80" aria-hidden="true" onClick={handleClose} />
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:align-middle">
          <div className="bg-white px-6 pb-5 pt-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white" id="modal-title">문서 등록</h3>
              <button
                type="button"
                disabled={isProcessing}
                className="rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
                onClick={handleClose}
              >
                <span className="sr-only">닫기</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">문서 제목</label>
                  <input
                    type="text"
                    value={title}
                    disabled={isProcessing}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600"
                    placeholder="비워두면 첫 제목 사용"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">카테고리</label>
                  <select
                    value={category}
                    disabled={isProcessing}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setLocalError(null);
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600"
                  >
                    <option value="">카테고리 선택</option>
                    {DOCUMENT_CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                    <option value={CUSTOM_CATEGORY_VALUE}>직접 추가</option>
                  </select>
                  {category === CUSTOM_CATEGORY_VALUE && (
                    <input
                      type="text"
                      value={customCategory}
                      disabled={isProcessing}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setLocalError(null);
                      }}
                      maxLength={20}
                      className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600"
                      placeholder="새 카테고리 입력"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">원본 URL</label>
                <input
                  type="url"
                  value={url}
                  disabled={isProcessing}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setLocalError(null);
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600"
                  placeholder="https://docs.riido.io/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Markdown 파일</label>
                <div
                  className="mt-1 rounded-md border-2 border-dashed border-gray-300 px-6 py-7 text-center hover:border-indigo-300 dark:border-gray-600 dark:hover:border-indigo-500"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3" />
                  </svg>
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <button
                      type="button"
                      disabled={isProcessing}
                      className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={() => inputRef.current?.click()}
                    >
                      .md 파일 선택
                    </button>
                    <span className="ml-1">또는 파일을 드롭</span>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".md,text/markdown,text/plain"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">파일당 최대 5MB</p>
                </div>
                {file && (
                  <div className="mt-2 flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900/50">
                    <span className="truncate text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      disabled={isProcessing}
                      className="ml-3 text-gray-400 hover:text-red-600 disabled:opacity-50 dark:text-gray-500 dark:hover:text-red-400"
                      onClick={() => setFile(null)}
                    >
                      제거
                    </button>
                  </div>
                )}
              </div>

              {localError && <p className="whitespace-pre-line text-sm text-red-600 dark:text-red-400">{localError}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
            <button
              type="button"
              disabled={isProcessing}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleClose}
            >
              취소
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void handleSubmit()}
            >
              {isProcessing ? '업로드 중' : '업로드'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
