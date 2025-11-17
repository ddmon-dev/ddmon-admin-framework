type Notice = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  category: 'notice' | 'normal';
};

export const mockData: Notice[] = [
  {
    id: '1',
    title: '서비스 점검 안내',
    author: '관리자',
    createdAt: '2024-01-15',
    viewCount: 1520,
    category: 'notice',
  },
  {
    id: '2',
    title: '새로운 기능 업데이트',
    author: '개발팀',
    createdAt: '2024-01-14',
    viewCount: 892,
    category: 'normal',
  },
  {
    id: '3',
    title: '보안 정책 변경 안내',
    author: '보안팀',
    createdAt: '2024-01-13',
    viewCount: 2341,
    category: 'notice',
  },
  {
    id: '4',
    title: '이벤트 당첨자 발표',
    author: '마케팅팀',
    createdAt: '2024-01-12',
    viewCount: 3456,
    category: 'normal',
  },
  {
    id: '5',
    title: '개인정보 처리방침 개정',
    author: '법무팀',
    createdAt: '2024-01-11',
    viewCount: 1234,
    category: 'normal',
  },
  {
    id: '6',
    title: '신규 파트너사 제휴 안내',
    author: '사업팀',
    createdAt: '2024-01-10',
    viewCount: 567,
    category: 'normal',
  },
  {
    id: '7',
    title: '모바일 앱 업데이트 안내',
    author: '개발팀',
    createdAt: '2024-01-09',
    viewCount: 2100,
    category: 'normal',
  },
  {
    id: '8',
    title: '고객센터 운영시간 변경',
    author: '고객지원팀',
    createdAt: '2024-01-08',
    viewCount: 890,
    category: 'notice',
  },
  {
    id: '9',
    title: '시스템 장애 복구 완료',
    author: '인프라팀',
    createdAt: '2024-01-07',
    viewCount: 4521,
    category: 'normal',
  },
  {
    id: '10',
    title: '설 연휴 배송 안내',
    author: '물류팀',
    createdAt: '2024-01-06',
    viewCount: 1678,
    category: 'notice',
  },
  {
    id: '11',
    title: '2024년 사업 계획 발표',
    author: '경영지원팀',
    createdAt: '2024-01-05',
    viewCount: 3210,
    category: 'normal',
  },
  {
    id: '12',
    title: '채용 공고',
    author: '인사팀',
    createdAt: '2024-01-04',
    viewCount: 5432,
    category: 'normal',
  },
  {
    id: '13',
    title: 'API 버전 업그레이드',
    author: '개발팀',
    createdAt: '2024-01-03',
    viewCount: 987,
    category: 'normal',
  },
  {
    id: '14',
    title: '결제 시스템 개선',
    author: '결제팀',
    createdAt: '2024-01-02',
    viewCount: 1456,
    category: 'normal',
  },
  {
    id: '15',
    title: '신년 인사',
    author: 'CEO',
    createdAt: '2024-01-01',
    viewCount: 8901,
    category: 'normal',
  },
];
