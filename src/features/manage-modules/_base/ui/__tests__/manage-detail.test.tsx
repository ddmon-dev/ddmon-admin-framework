import { render, screen } from '@testing-library/react';
import { DetailField } from '../manage-detail';

describe('DetailField', () => {
  it('숫자 0은 빈 값이 아니라 "0"으로 표시한다', () => {
    render(<DetailField label="조회수" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('-')).not.toBeInTheDocument();
  });

  it('빈 문자열은 emptyText로 표시한다', () => {
    render(<DetailField label="첨부" value="" />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('undefined는 emptyText로 표시한다', () => {
    render(<DetailField label="비고" />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('커스텀 emptyText를 반영한다', () => {
    render(<DetailField label="비고" value={null} emptyText="없음" />);

    expect(screen.getByText('없음')).toBeInTheDocument();
  });
});
