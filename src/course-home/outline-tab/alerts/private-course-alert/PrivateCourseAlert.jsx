import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { Alert, Hyperlink } from '@openedx/paragon';

import genericMessages from '../../../../generic/messages';
import outlineMessages from '../../messages';
import { useModel } from '../../../../generic/model-store';

const PrivateCourseAlert = ({ payload }) => {
  const intl = useIntl();
  const {
    anonymousUser,
    courseId,
  } = payload;

  const {
    title,
  } = useModel('courseHomeMeta', courseId);

  const signIn = (
    <Hyperlink
      style={{ textDecoration: 'underline' }}
      destination={`${getLoginRedirectUrl(global.location.href)}`}
    >
      {intl.formatMessage(genericMessages.signInSentenceCase)}
    </Hyperlink>
  );

  return (
    <Alert variant="light" data-testid="private-course-alert">
      {anonymousUser && (
        <FormattedMessage
          id="learning.privateCourse.signIn"
          description="Prompts the user to sign in to see course content."
          defaultMessage="{signIn} to see course content."
          values={{
            signIn,
          }}
        />
      )}
      {!anonymousUser && (
        <p className="font-weight-bold mb-0">{intl.formatMessage(outlineMessages.welcomeTo)} {title}</p>
      )}
    </Alert>
  );
};

PrivateCourseAlert.propTypes = {
  payload: PropTypes.shape({
    anonymousUser: PropTypes.bool,
    courseId: PropTypes.string,
  }).isRequired,
};

export default PrivateCourseAlert;
