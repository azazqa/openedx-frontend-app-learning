import messages from './messages';

export type FormatMessage = (
  descriptor: { id: string; defaultMessage: string; description?: string },
  values?: Record<string, string | number>,
) => string;

/**
 * 강의 목록·사이드 목차에 보이는 CMS/LMS 영문 조각을 번역 메시지로 바꿉니다.
 * 번역 문구는 번역 저장소의 klms.outline.* overrides 에 있습니다.
 */
export default function localizeOutlineText(
  text: string | null | undefined,
  formatMessage: FormatMessage,
): string {
  if (!text) {
    return '';
  }
  return text
    .replace(/\((\d+)\s+Questions?\)/gi, (_, count: string) => formatMessage(
      messages.questionCount,
      { count: Number(count) },
    ))
    .replace(/\bTimed Exam\b/g, () => formatMessage(messages.timedExam));
}
