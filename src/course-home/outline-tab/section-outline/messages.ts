import { defineMessages } from '@edx/frontend-platform/i18n';

// KLMS: 목차·차시 시간 표기. 영어 기본값만 두고 한국어는 번역 저장소 overrides(klms.outline.*)에 있습니다.
const messages = defineMessages({
  timedExam: {
    id: 'klms.outline.timedExam',
    defaultMessage: 'Timed Exam',
    description: 'Label for a timed exam in the course outline (CMS/LMS English fragment)',
  },
  questionCount: {
    id: 'klms.outline.questionCount',
    defaultMessage: '({count} Questions)',
    description: 'Question count suffix in the course outline, e.g. (5 Questions)',
  },
  studyHours: {
    id: 'klms.outline.studyTime.hours',
    defaultMessage: '{hours}h',
    description: 'Study time formatted as hours only',
  },
  studyHoursMinutes: {
    id: 'klms.outline.studyTime.hoursMinutes',
    defaultMessage: '{hours}h {minutes}m',
    description: 'Study time formatted as hours and minutes',
  },
  studyMinutes: {
    id: 'klms.outline.studyTime.minutes',
    defaultMessage: '{minutes}m',
    description: 'Study time formatted as minutes only',
  },
  studyMinutesSeconds: {
    id: 'klms.outline.studyTime.minutesSeconds',
    defaultMessage: '{minutes}m {seconds}s',
    description: 'Study time formatted as minutes and seconds',
  },
  studySeconds: {
    id: 'klms.outline.studyTime.seconds',
    defaultMessage: '{seconds}s',
    description: 'Study time formatted as seconds only',
  },
});

export default messages;
