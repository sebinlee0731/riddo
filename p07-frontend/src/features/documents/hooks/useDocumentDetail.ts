import { useCallback, useEffect, useState } from 'react';
import { getDocument } from '../api';
import type { DocumentDetail } from '../types';

export function useDocumentDetail(id: number | null) {
  const [data, setData] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id == null) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const doc = await getDocument(id);
      setData(doc);
    } catch (e) {
      setError(e instanceof Error ? e.message : '문서 상세 조회 실패');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return { data, isLoading, error, refetch: fetchDetail };
}
