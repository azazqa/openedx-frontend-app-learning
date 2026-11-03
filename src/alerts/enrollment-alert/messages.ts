import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  alert: {
    id: 'learning.enrollment.alert',
    defaultMessage: 'You must be enrolled in the course to see course content.',
    description: 'Message shown to indicate that a user needs to enroll in a course prior to viewing the course content.',
  },
  staffAlert: {
    id: 'learning.staff.enrollment.alert',
    defaultMessage: 'You are viewing this course as staff, and are not enrolled.',
    description: 'Message shown to indicate that a user is not enrolled, but is able to view a course anyway because they are staff.',
  },
});

export default messages;
