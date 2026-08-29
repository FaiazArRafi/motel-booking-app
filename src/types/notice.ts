export type NoticeType = 'information' | 'warning' | 'important';

export interface Notice {
  noticeId: string;
  title: string;
  message: string;
  type: NoticeType;
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
}
