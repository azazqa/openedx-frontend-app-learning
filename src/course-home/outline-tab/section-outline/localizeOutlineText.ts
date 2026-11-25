/** 강의 목록·사이드 목차에 보이는 CMS/LMS 영문 조각을 한글로 맞춘다. */
export default function localizeOutlineText(text: string | null | undefined): string {
  if (!text) {
    return '';
  }
  return text
    .replace(/\((\d+)\s+Questions?\)/gi, '($1 문항)')
    .replace(/\bTimed Exam\b/g, '시간 제한 시험');
}
