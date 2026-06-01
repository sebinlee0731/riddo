import { useCallback, useEffect, useState } from 'react';
import { listDocuments } from '../api';
import type { DocumentSummary } from '../types';

export function useDocuments() {
  const [data, setData] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const docs = await listDocuments();
      setData(docs);
    } catch (e) {
      setError(e instanceof Error ? e.message : '문서 목록 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDocs();
  }, [fetchDocs]);

  const counts = {
    total: data.length,
    indexed: data.filter(d => d.status === 'indexed').length,
    indexing: data.filter(d => d.status === 'indexing').length,
    failed: data.filter(d => d.status === 'failed').length,
  };

  return { data, counts, isLoading, error, refetch: fetchDocs };
}
