import { chasiMark, sequenceStatus } from './chasiMark';

describe('chasiMark', () => {
  it('keeps the Open edX check outside a refund course', () => {
    expect(chasiMark(false, '1.3')).toBe('edx');
    expect(chasiMark(false, undefined)).toBe('edx');
  });

  it('keeps the Open edX check for sequences without a progress rate', () => {
    expect(chasiMark(true, undefined)).toBe('edx');
  });

  it('uses an empty circle at zero even after study has started', () => {
    expect(chasiMark(true, '0.0')).toBe('open');
    expect(sequenceStatus('open', true)).toBe('open');
  });

  it('uses the in-progress mark below half', () => {
    expect(chasiMark(true, '1.3')).toBe('progress');
    expect(chasiMark(true, '49.9')).toBe('progress');
  });

  it('uses the check at half and above', () => {
    expect(chasiMark(true, '50.0')).toBe('done');
    expect(chasiMark(true, '100.0')).toBe('done');
  });
});
