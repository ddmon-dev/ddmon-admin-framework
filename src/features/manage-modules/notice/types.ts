export interface ListRow {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  category: 'notice' | 'normal';
}
