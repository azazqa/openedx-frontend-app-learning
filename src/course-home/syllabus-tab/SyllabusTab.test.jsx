import { getConfig } from '@edx/frontend-platform';

import { syllabusIFrameUrl, syllabusUsageKey } from './SyllabusTab';

const courseId = 'course-v1:KLMS+ai13+20261101';

describe('syllabusUsageKey', () => {
  it('builds static_tab syllabus usage key from course id', () => {
    expect(syllabusUsageKey(courseId)).toBe(
      'block-v1:KLMS+ai13+20261101+type@static_tab+block@syllabus',
    );
  });

  it('returns null for unexpected course ids', () => {
    expect(syllabusUsageKey('not-a-course')).toBeNull();
  });
});

describe('syllabusIFrameUrl', () => {
  it('points at LMS xblock student_view', () => {
    const url = syllabusIFrameUrl(courseId);
    expect(url).toContain(`${getConfig().LMS_BASE_URL}/xblock/`);
    expect(url).toContain('type@static_tab+block@syllabus');
    expect(url).toContain('view=student_view');
  });
});
