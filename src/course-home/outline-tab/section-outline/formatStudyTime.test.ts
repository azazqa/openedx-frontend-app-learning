import { formatStudyTime } from './formatStudyTime';

describe('formatStudyTime', () => {
  it('shows seconds under a minute', () => {
    expect(formatStudyTime(27)).toBe('27초');
  });

  it('shows minutes and seconds', () => {
    expect(formatStudyTime((18 * 60) + 12)).toBe('18분 12초');
  });

  it('shows hours and minutes', () => {
    expect(formatStudyTime(3600 + (2 * 60))).toBe('1시간 2분');
  });
});
