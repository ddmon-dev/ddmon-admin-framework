export interface AppHeaderConfig {
  /** 헤더 타이틀 */
  title?: string;
  /** 타이틀 옆 영역 (모바일 필터 버튼 등) */
  topLeft?: React.ReactNode;
  /** 상단 우측 영역 (액션 버튼 등) */
  topRight?: React.ReactNode;
  /** 하단 전체 영역 (bottomLeft/bottomRight 대신 사용) */
  bottom?: React.ReactNode;
  /** 하단 좌측 영역 (필터 등) */
  bottomLeft?: React.ReactNode;
  /** 하단 우측 영역 (검색바 등) */
  bottomRight?: React.ReactNode;
  /** 추가 className */
  className?: string;
}
