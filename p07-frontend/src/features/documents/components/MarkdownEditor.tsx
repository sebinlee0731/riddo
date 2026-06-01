import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type MarkdownEditorTab = 'edit' | 'preview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  activeTab: MarkdownEditorTab;
  onTabChange: (tab: MarkdownEditorTab) => void;
  disabled?: boolean;
}

const markdownComponents: Components = {
  h1: (props) => (
    <h1
      className="mb-4 mt-0 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-950 dark:border-gray-700 dark:text-white"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-3 mt-6 border-b border-gray-100 pb-1 text-xl font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  h4: (props) => (
    <h4 className="mb-2 mt-4 text-base font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  p: (props) => <p className="my-3 leading-7 text-gray-700 dark:text-gray-200" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  ul: (props) => <ul className="my-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-200" {...props} />,
  ol: (props) => <ol className="my-3 list-decimal space-y-1 pl-6 text-gray-700 dark:text-gray-200" {...props} />,
  li: (props) => <li className="pl-1 leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-4 border-indigo-300 bg-indigo-50 px-4 py-2 text-gray-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-gray-200"
      {...props}
    />
  ),
  code: ({ className, ...props }) => {
    const isBlockCode = className?.startsWith('language-');
    return (
      <code
        className={
          isBlockCode
            ? `font-mono text-sm ${className ?? ''}`
            : `rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-rose-700 dark:bg-gray-800 dark:text-rose-300 ${className ?? ''}`
        }
        {...props}
      />
    );
  },
  pre: (props) => (
    <pre
      className="my-4 overflow-x-auto rounded-md border border-gray-800 bg-gray-950 p-4 text-sm text-gray-100 shadow-sm"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-gray-300 bg-gray-100 px-3 py-2 font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-gray-300 px-3 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200" {...props} />
  ),
  hr: (props) => <hr className="my-6 border-gray-200 dark:border-gray-700" {...props} />,
  strong: (props) => <strong className="font-semibold text-gray-950 dark:text-white" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  del: (props) => <del className="text-gray-500 line-through dark:text-gray-400" {...props} />,
};

export default function MarkdownEditor({
  value,
  onChange,
  activeTab,
  onTabChange,
  disabled = false,
}: MarkdownEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            type="button"
            onClick={() => onTabChange('edit')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'edit'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'
            }`}
          >
            편집 (Raw Markdown)
          </button>
          <button
            type="button"
            onClick={() => onTabChange('preview')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'
            }`}
          >
            미리보기 (Markdown)
          </button>
        </nav>
      </div>
      
      <div className="mt-4 flex-1 overflow-y-auto rounded-b-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        {activeTab === 'edit' ? (
          <textarea
            className="h-full min-h-[500px] w-full resize-none rounded-md border border-gray-300 bg-white p-4 font-mono text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div className="min-h-[500px] rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {value}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
