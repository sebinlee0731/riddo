import api from '@/lib/api';
import type {
  UnansweredListResponse,
  UnansweredSort,
  UnansweredStatus,
  UpdateUnansweredPayload,
  UpdateUnansweredResponse,
} from './types';

interface Envelope<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

export interface ListUnansweredParams {
  page: number;
  limit: number;
  status?: UnansweredStatus | 'all';
  sort: UnansweredSort;
}

export async function listUnansweredQuestions(
  params: ListUnansweredParams,
): Promise<UnansweredListResponse> {
  const res = await api.get<Envelope<UnansweredListResponse>>('/admin/unanswered', {
    params: {
      page: params.page,
      limit: params.limit,
      sort: params.sort,
      ...(params.status && params.status !== 'all' ? { status: params.status } : {}),
    },
  });
  return res.data.data;
}

export async function updateUnansweredQuestion(
  id: number,
  payload: UpdateUnansweredPayload,
): Promise<UpdateUnansweredResponse> {
  const res = await api.patch<Envelope<UpdateUnansweredResponse>>(
    `/admin/unanswered/${id}`,
    payload,
  );
  return res.data.data;
}
