export type ChasiMark = 'done' | 'progress' | 'open' | 'edx';

export type SequenceStatus = 'done' | 'progress' | 'open';

/** 환급 수강의 차시 아이콘. 비율은 강의 목록에 보이는 소수 한 자리입니다. */
export function chasiMark(refund: boolean, percent?: string): ChasiMark {
  if (!refund || percent === undefined) {
    return 'edx';
  }
  const value = Number(percent);
  if (!Number.isFinite(value) || value <= 0) {
    return 'open';
  }
  if (value >= 50) {
    return 'done';
  }
  return 'progress';
}

export function sequenceStatus(mark: ChasiMark, edxComplete: boolean): SequenceStatus {
  if (mark === 'progress') {
    return 'progress';
  }
  if (mark === 'done' || (mark === 'edx' && edxComplete)) {
    return 'done';
  }
  return 'open';
}
