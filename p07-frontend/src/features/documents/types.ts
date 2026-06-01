// BE의 document.status CHECK 제약과 동일: pending | indexing | indexed | failed
export type DocumentStatus = "pending" | "indexing" | "indexed" | "failed";

export const DOCUMENT_CATEGORY_OPTIONS = [
  "시작하기",
  "워크스페이스",
  "팀",
  "작업 관리",
  "작업 보기",
  "문서 및 협업",
  "스프린트",
  "미팅",
  "AI",
  "외부연동",
  "검색 및 데이터",
] as const;

export const UNCATEGORIZED_CATEGORY = "미분류";

export type DocumentCategory = string;

export interface DocumentSummary {
  id: number;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  sourceUrl?: string;
}

export interface DocumentDetail extends DocumentSummary {
  markdown: string;
}
