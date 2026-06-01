export type StatsPeriod = 'today' | '7d' | '30d' | 'all';

export interface StatsOverview {
  totalQuestions: number;
  totalFeedback: number;
  satisfactionRate: number | null;
  totalUnanswered: number;
  totalIndexedDocs: number;
}

export interface TopQuery {
  query: string;
  count: number;
}

export interface DailySatisfaction {
  date: string;
  thumbUp: number;
  thumbDown: number;
}

export interface SatisfactionStats {
  summary: {
    total: number;
    thumbUp: number;
    thumbDown: number;
    satisfactionRate: number | null;
  };
  daily: DailySatisfaction[];
}

export interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

// 일별 질문 수 추이용 데이터. 백엔드 일별 질문 API가 생기면 실제 응답으로 교체한다.
export interface DailyQueryStat {
  date: string;
  success: number;
  failure: number;
}
