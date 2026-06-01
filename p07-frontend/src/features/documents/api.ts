// 문서 관리 API 클라이언트.
// BE 응답은 `{ success, data, error }` envelope. 여기서 data 만 추출해 반환한다.
// 엔드포인트 정의: workspace/P07 capstone.postman_collection.json (Docs 섹션)

import api from "@/lib/api";
import type {
  DocumentDetail,
  DocumentStatus,
  DocumentSummary,
} from "./types";
import { UNCATEGORIZED_CATEGORY } from "./types";

// BE findAll() 응답 (docs.service.ts) 의 한 항목
interface BackendDocSummary {
  docId: number;
  title: string;
  category?: string | null;
  source: "file" | "url";
  sourceValue: string | null;
  chunkCount: number;
  indexStatus: DocumentStatus;
  updatedAt: string;
}

// BE findOne() 응답
interface BackendDocDetail extends BackendDocSummary {
  createdAt: string;
  markdown?: string;
}

interface Envelope<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

function toSummary(b: BackendDocSummary): DocumentSummary {
  return {
    id: b.docId,
    title: b.title,
    category: b.category?.trim() || UNCATEGORIZED_CATEGORY,
    status: b.indexStatus,
    sourceUrl: b.sourceValue ?? undefined,
  };
}

export async function listDocuments(): Promise<DocumentSummary[]> {
  const res = await api.get<Envelope<{ docs: BackendDocSummary[] }>>("/docs");
  return res.data.data.docs.map(toSummary);
}

export async function getDocument(id: number): Promise<DocumentDetail> {
  const res = await api.get<Envelope<BackendDocDetail>>(`/docs/${id}`);
  const b = res.data.data;
  return {
    ...toSummary(b),
    markdown: b.markdown ?? "",
  };
}

export interface UploadDocumentPayload {
  file: File;
  category: string;
  url?: string;
  title?: string;
}

export async function uploadDocument(
  payload: UploadDocumentPayload,
): Promise<{ docId: number; indexStatus: DocumentStatus; message: string }> {
  const fd = new FormData();
  fd.append("source", "file");
  fd.append("category", payload.category);
  if (payload.title) fd.append("title", payload.title);
  fd.append("file", payload.file);
  if (payload.url) fd.append("url", payload.url);

  // 주의: Content-Type 을 명시하지 않는다 — axios 가 FormData 를 인식하면
  // boundary 가 포함된 `multipart/form-data; boundary=...` 를 자동 설정한다.
  // 수동으로 'multipart/form-data' 만 주면 boundary 가 빠져 multer 가 파싱 실패한다.
  const res = await api.post<
    Envelope<{ docId: number; title: string; category: string; indexStatus: DocumentStatus; message: string }>
  >("/docs", fd);
  return res.data.data;
}

export interface UpdateDocumentPayload {
  title?: string;
  category?: string;
  markdown?: string;
  file?: File;
}

export async function updateDocument(
  id: number,
  payload: UpdateDocumentPayload,
): Promise<{ docId: number; indexStatus: DocumentStatus; message: string }> {
  const fd = new FormData();
  if (payload.title !== undefined) fd.append("title", payload.title);
  if (payload.category !== undefined) fd.append("category", payload.category);
  if (payload.markdown !== undefined) fd.append("markdown", payload.markdown);
  if (payload.file) fd.append("file", payload.file);

  const res = await api.put<
    Envelope<{ docId: number; title: string; indexStatus: DocumentStatus; message: string }>
  >(`/docs/${id}`, fd);
  return res.data.data;
}

export async function deleteDocument(
  id: number,
): Promise<{ docId: number; deletedChunks: number; message: string }> {
  const res = await api.delete<
    Envelope<{ docId: number; deletedChunks: number; message: string }>
  >(`/docs/${id}`);
  return res.data.data;
}

export async function reindexDocument(
  id: number,
): Promise<{ docId: number; indexStatus: DocumentStatus }> {
  const res = await api.post<
    Envelope<{ docId: number; indexStatus: DocumentStatus }>
  >(`/docs/${id}/reindex`);
  return res.data.data;
}
