export type UnansweredStatus = 'unresolved' | 'resolved' | 'dismissed';
export type UnansweredReason = 'out_of_scope' | 'no_document' | null;
export type UnansweredSort = 'frequency' | 'latest';

export interface UnansweredQuestion {
  id: number;
  question: string;
  reason: UnansweredReason;
  status: UnansweredStatus;
  frequency: number;
  resolvedBy: number | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UnansweredListResponse {
  total: number;
  page: number;
  limit: number;
  items: UnansweredQuestion[];
}

export interface UpdateUnansweredPayload {
  status: UnansweredStatus;
  resolvedBy?: number | null;
}

export interface UpdateUnansweredResponse {
  id: number;
  status: UnansweredStatus;
  resolvedBy: number | null;
  updatedAt: string | null;
}
