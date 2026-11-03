import React, { useMemo } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useSelector } from 'react-redux';

import { useIFrameHeight } from '../../generic/hooks';

/**
 * course-v1:ORG+NUM+RUN → block-v1:ORG+NUM+RUN+type@static_tab+block@syllabus
 */
export function syllabusUsageKey(courseId) {
  if (!courseId || !courseId.startsWith('course-v1:')) {
    return null;
  }
  return `${courseId.replace(/^course-v1:/, 'block-v1:')}+type@static_tab+block@syllabus`;
}

export function syllabusIFrameUrl(courseId) {
  const usageKey = syllabusUsageKey(courseId);
  if (!usageKey) {
    return null;
  }
  const url = new URL(`${getConfig().LMS_BASE_URL}/xblock/${usageKey}`);
  url.searchParams.set('view', 'student_view');
  url.searchParams.set('show_title', '0');
  url.searchParams.set('show_bookmark', '0');
  return url.toString();
}

/**
 * Modulestore StaticTab(syllabus) student_view 를 LMS XBlock iframe 으로 표시한다.
 * 본문 HTML·/klms/brand/syllabus.css|js 는 LMS 가 그대로 제공한다.
 */
const SyllabusTab = () => {
  const { courseId } = useSelector(state => state.courseHome);
  const [, iFrameHeight] = useIFrameHeight();
  const src = useMemo(() => syllabusIFrameUrl(courseId), [courseId]);

  if (!src) {
    return null;
  }

  return (
    <iframe
      src={src}
      className="d-flex w-100 border-0"
      height={iFrameHeight}
      style={{ minHeight: '40rem' }}
      title="강의 계획서"
      data-testid="syllabus-tab-iframe"
    />
  );
};

export default SyllabusTab;
