import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { initializeMockApp } from '../../setupTest';
import { appendBrowserTimezoneToUrl } from '../../utils';
import { getCourseHomeCourseMetadata, isSyllabusTab, learningSyllabusUrl } from './api';

initializeMockApp();

const axiosMock = new MockAdapter(getAuthenticatedHttpClient());

describe('syllabus tab URL rewrite', () => {
  const courseId = 'course-v1:KLMS+ai13+20261101';

  afterEach(() => {
    axiosMock.reset();
  });

  it('detects static_tab_syllabus by tab id or url', () => {
    expect(isSyllabusTab({ tabId: 'static_tab_syllabus', url: 'https://lms/x' })).toBe(true);
    expect(isSyllabusTab({ tabId: 'courseware', url: `https://lms/courses/${courseId}/syllabus/` })).toBe(true);
    expect(isSyllabusTab({ tabId: 'dates', url: 'https://apps/learning/course/x/dates' })).toBe(false);
  });

  it('rewrites syllabus tab url to learning MFE route', async () => {
    const metadataUrl = appendBrowserTimezoneToUrl(
      `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseId}`,
    );
    axiosMock.onGet(metadataUrl).reply(200, {
      course_id: courseId,
      tabs: [
        {
          tab_id: 'courseware',
          title: 'Course',
          url: `${getConfig().BASE_URL}/course/${courseId}/home`,
        },
        {
          tab_id: 'static_tab_syllabus',
          title: '강의 계획서',
          url: `${getConfig().LMS_BASE_URL}/courses/${courseId}/syllabus/`,
        },
      ],
      course_access: { has_access: true },
      original_user_is_staff: false,
      is_staff: false,
    });

    const data = await getCourseHomeCourseMetadata(courseId, 'outline');
    expect(data.tabs[0].slug).toBe('outline');
    expect(data.tabs[1].slug).toBe('static_tab_syllabus');
    expect(data.tabs[1].url).toBe(`${getConfig().BASE_URL}/course/${courseId}/syllabus`);
    expect(data.tabs[1].url).toBe(learningSyllabusUrl(courseId, [
      { tabId: 'courseware', url: `${getConfig().BASE_URL}/course/${courseId}/home` },
    ]));
  });

  it('rewrites from courseware MFE home URL when BASE_URL has no scheme', () => {
    const home = `https://apps.example.com/learning/course/${courseId}/home`;
    expect(learningSyllabusUrl(courseId, [
      { tabId: 'courseware', url: home },
    ])).toBe(`https://apps.example.com/learning/course/${courseId}/syllabus`);
  });
});
