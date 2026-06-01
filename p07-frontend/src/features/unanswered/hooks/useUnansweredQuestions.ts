import { useCallback, useEffect, useState } from 'react';
import {
  listUnansweredQuestions,
  updateUnansweredQuestion,
  type ListUnansweredParams,
} from '../api';
import type {
  UnansweredListResponse,
  UpdateUnansweredPayload,
} from '../types';

export function useUnansweredQuestions(params: ListUnansweredParams) {
  const [data, setData] = useState<UnansweredListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listUnansweredQuestions(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '무응답 질문 목록 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    const run = Promise.resolve().then(() => refetch());
    return () => {
      void run;
    };
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useUpdateUnansweredQuestion() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: number, payload: UpdateUnansweredPayload) => {
    setIsPending(true);
    setError(null);
    try {
      return await updateUnansweredQuestion(id, payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : '무응답 질문 처리 실패';
      setError(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}
