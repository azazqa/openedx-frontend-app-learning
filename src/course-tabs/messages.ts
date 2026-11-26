import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  courseMaterial: {
    id: 'learn.navigation.course.tabs.label',
    defaultMessage: 'Course Material',
    description: 'The accessible label for course tabs navigation',
  },
  // KLMS: 상단 바 「강의」 메뉴와 구분하려고 courseware 탭 제목을 이 메시지로 바꿉니다. 한국어는 overrides 에 있습니다.
  courseListTab: {
    id: 'klms.courseTabs.courseList',
    defaultMessage: 'Course List',
    description: 'Title of the courseware tab in the course navigation (distinct from the header Courses link)',
  },
});

export default messages;
