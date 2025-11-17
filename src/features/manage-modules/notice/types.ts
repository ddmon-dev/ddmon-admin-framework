export interface Row {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  category: 'notice' | 'normal';
}
