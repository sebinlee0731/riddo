import { useState } from 'react';
import {
  deleteDocument,
  reindexDocument,
  updateDocument,
  type UpdateDocumentPayload,
} from '../api';

// 수정/삭제/재색인 mutation 훅 묶음. 호출자가 onSuccess 콜백으로 부모 refetch 트리거.

export function useUpdateDocument() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: number, payload: UpdateDocumentPayload) => {
    setIsPending(true);
    setError(null);
    try {
      return await updateDocument(id, payload);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '문서 수정 실패';
      setError(msg);
      throw e;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}

export function useDeleteDocument() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: number) => {
    setIsPending(true);
    setError(null);
    try {
      return await deleteDocument(id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '문서 삭제 실패';
      setError(msg);
      throw e;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}

export function useReindexDocument() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: number) => {
    setIsPending(true);
    setError(null);
    try {
      return await reindexDocument(id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '재색인 실패';
      setError(msg);
      throw e;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}
