'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataList, useDataList, SearchBar, CategoryButtonGroup } from '@/shared/ui/data-list';

type Notice = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  category: 'notice' | 'normal';
};

const mockNotices: Notice[] = [
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

const columns: ColumnDef<Notice>[] = [
  {
    accessorKey: 'title',
    header: '제목',
    enableSorting: true,
    cell: ({ row }) => {
      const notice = row.original;
      const isNotice = notice.category === 'notice';

      return (
        <>
          {isNotice && <strong className='text-primary mr-1'>[공지]</strong>}
          {notice.title}
        </>
      );
    },
  },
  {
    accessorKey: 'author',
    header: '작성자',
    size: 120,
  },
  {
    accessorKey: 'createdAt',
    header: '작성일',
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: 'viewCount',
    header: '조회수',
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const count = row.getValue('viewCount') as number;
      return <div className='text-right'>{count.toLocaleString()}</div>;
    },
  },
];

export function DemoList() {
  const { page, sort, search, category, setPage, setSort } = useDataList({
    totalCount: mockNotices.length,
    pageSize: 5,
  });

  const { filteredData, totalCount } = useMemo(() => {
    // 필터링
    let result = mockNotices;
    if (search) {
      result = result.filter(
        notice =>
          notice.title.toLowerCase().includes(search.toLowerCase()) ||
          notice.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log(category);

    if (category) {
      result = result.filter(notice => notice.category === category);
    }

    // 정렬
    if (sort) {
      const isDesc = sort.startsWith('-');
      const sortKey = isDesc ? sort.slice(1) : sort;

      result = [...result].sort((a, b) => {
        const aValue = a[sortKey as keyof Notice];
        const bValue = b[sortKey as keyof Notice];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return isDesc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return isDesc ? bValue - aValue : aValue - bValue;
        }
        return 0;
      });
    }

    const totalCount = result.length;

    // 페이지네이션
    const pageSize = 5;
    const startIndex = (page - 1) * pageSize;
    const pagedData = result.slice(startIndex, startIndex + pageSize);

    return { filteredData: pagedData, totalCount };
  }, [search, sort, page, category]);

  const pageSize = 5;
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <SearchBar />
        <CategoryButtonGroup
          options={[
            { value: 'notice', label: '공지' },
            { value: 'normal', label: '일반' },
          ]}
        />
      </div>
      <DataList
        data={filteredData}
        columns={columns}
        pageCount={pageCount}
        currentPage={page}
        onPageChange={setPage}
        sortingKey={sort}
        onSortingChange={setSort}
      />
    </div>
  );
}
