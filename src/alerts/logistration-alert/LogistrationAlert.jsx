import React from 'react';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { Alert, Hyperlink } from '@openedx/paragon';
import { WarningFilled } from '@openedx/paragon/icons';

import genericMessages from '../../generic/messages';

const LogistrationAlert = () => {
  const intl = useIntl();
  const signIn = (
    <Hyperlink
      style={{ textDecoration: 'underline' }}
      destination={`${getLoginRedirectUrl(global.location.href)}`}
    >
      {intl.formatMessage(genericMessages.signInLowercase)}
    </Hyperlink>
  );

  return (
    <Alert variant="warning" icon={WarningFilled}>
      <FormattedMessage
        id="learning.logistration.alert.signIn"
        description="Prompts the user to sign in to see course content."
        defaultMessage="To see course content, {signIn}."
        values={{
          signIn,
        }}
      />
    </Alert>
  );
};

export default LogistrationAlert;
