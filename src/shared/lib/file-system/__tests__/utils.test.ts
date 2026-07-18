import { describe, it, expect } from 'vitest';
import { generateDatedFolder } from '../utils';

describe('generateDatedFolder', () => {
  it('접두어 뒤에 8자리 날짜 세그먼트를 붙인다', () => {
    expect(generateDatedFolder('notices')).toMatch(/^notices\/\d{8}$/);
  });

  it('접두어를 그대로 유지한다', () => {
    expect(generateDatedFolder('news').startsWith('news/')).toBe(true);
  });
});
