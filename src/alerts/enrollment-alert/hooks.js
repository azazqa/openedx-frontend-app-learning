/* eslint-disable import/prefer-default-export */
import React, {
  useContext, useMemo,
} from 'react';
import { AppContext } from '@edx/frontend-platform/react';

import { useAlert } from '../../generic/user-messages';
import { useModel } from '../../generic/model-store';

const EnrollmentAlert = React.lazy(() => import('./EnrollmentAlert'));

export function useEnrollmentAlert(courseId) {
  const { authenticatedUser } = useContext(AppContext);
  const course = useModel('courseHomeMeta', courseId);
  const outline = useModel('outline', courseId);
  const enrolledUser = course && course.isEnrolled !== undefined && course.isEnrolled;
  const privateOutline = outline && outline.courseBlocks && !outline.courseBlocks.courses;
  /**
   * Enrollment CTA was removed. Keep this alert only for staff viewing
   * a private outline while not enrolled.
   */
  const isStaff = course && course.isStaff;
  const isVisible = !enrolledUser && authenticatedUser !== null && privateOutline && isStaff;
  const payload = useMemo(() => ({
    courseId,
    extraText: outline && outline.enrollAlert ? outline.enrollAlert.extraText : '',
    isStaff: course && course.isStaff,
  }), [course, courseId, outline]);

  useAlert(isVisible, {
    code: 'clientEnrollmentAlert',
    payload,
    topic: 'outline',
  });

  return { clientEnrollmentAlert: EnrollmentAlert };
}
