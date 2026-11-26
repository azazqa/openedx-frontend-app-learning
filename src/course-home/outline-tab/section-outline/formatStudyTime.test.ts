import { formatStudyTime } from './formatStudyTime';

// 기본값(영어)으로 검증합니다. 한국어는 번역 저장소 overrides 가 채웁니다.
const formatMessage = (descriptor: { defaultMessage: string }, values: Record<string, string | number> = {}) => (
  descriptor.defaultMessage.replace(/\{(\w+)\}/g, (_, key) => String(values[key]))
);

describe('formatStudyTime', () => {
  it('formats seconds only', () => {
    expect(formatStudyTime(27, formatMessage)).toBe('27s');
  });

  it('formats minutes and seconds', () => {
    expect(formatStudyTime((18 * 60) + 12, formatMessage)).toBe('18m 12s');
  });

  it('formats hours and minutes', () => {
    expect(formatStudyTime(3600 + (2 * 60), formatMessage)).toBe('1h 2m');
  });
});
