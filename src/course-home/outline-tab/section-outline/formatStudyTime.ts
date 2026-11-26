import messages from './messages';
import type { FormatMessage } from './localizeOutlineText';

/** 차시 학습 시간을 표시합니다. 단위 문구는 번역 저장소(klms.outline.studyTime.*)에서 정합니다. */
export function formatStudyTime(totalSeconds: number, formatMessage: FormatMessage): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remain = seconds % 60;
  if (hours > 0) {
    return minutes > 0
      ? formatMessage(messages.studyHoursMinutes, { hours, minutes })
      : formatMessage(messages.studyHours, { hours });
  }
  if (minutes > 0) {
    return remain > 0
      ? formatMessage(messages.studyMinutesSeconds, { minutes, seconds: remain })
      : formatMessage(messages.studyMinutes, { minutes });
  }
  return formatMessage(messages.studySeconds, { seconds: remain });
}
