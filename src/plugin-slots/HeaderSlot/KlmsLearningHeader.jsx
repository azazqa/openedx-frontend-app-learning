import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { Dropdown } from '@openedx/paragon';
import AnonymousUserMenu from '@edx/frontend-component-header/dist/learning-header/AnonymousUserMenu';
import LogoSlot from '@edx/frontend-component-header/dist/plugin-slots/LogoSlot';
import CourseInfoSlot from '@edx/frontend-component-header/dist/plugin-slots/CourseInfoSlot';
import LearningHeaderActionsSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningHeaderActionsSlot';
import LearningUserMenuToggleSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningUserMenuToggleSlot';
import LearningUserMenuSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningUserMenuSlot';

import messages from './messages';

const KlmsUserMenu = ({ username }) => {
  const intl = useIntl();
  const config = getConfig();
  const items = [
    {
      message: intl.formatMessage(messages.dashboard),
      href: `${config.LMS_BASE_URL}/dashboard`,
    },
    {
      message: intl.formatMessage(messages.profile),
      href: `${config.ACCOUNT_PROFILE_URL}/u/${username}`,
    },
    {
      message: intl.formatMessage(messages.account),
      href: config.ACCOUNT_SETTINGS_URL,
    },
    {
      message: intl.formatMessage(messages.logout),
      href: config.LOGOUT_URL,
    },
  ];

  return (
    <Dropdown className="user-dropdown ml-3">
      <Dropdown.Toggle
        variant="outline-primary"
        aria-label={intl.formatMessage(messages.userOptionsDropdownLabel)}
      >
        <LearningUserMenuToggleSlot label={username} icon={faUserCircle} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-right">
        <LearningUserMenuSlot items={items} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

KlmsUserMenu.propTypes = {
  username: PropTypes.string.isRequired,
};

const KlmsLearningHeader = ({
  courseOrg, courseNumber, courseTitle, showUserDropdown,
}) => {
  const intl = useIntl();
  const { authenticatedUser } = useContext(AppContext);

  return (
    <header className="learning-header">
      <a className="sr-only sr-only-focusable" href="#main-content">
        {intl.formatMessage(messages.skipNavLink)}
      </a>
      <div className="container-xl py-2 d-flex align-items-center">
        <LogoSlot
          href={`${getConfig().LMS_BASE_URL}/dashboard`}
          src={getConfig().LOGO_URL}
          alt={getConfig().SITE_NAME}
        />
        <div className="flex-grow-1 course-title-lockup d-flex" style={{ lineHeight: 1 }}>
          <CourseInfoSlot
            courseOrg={courseOrg}
            courseNumber={courseNumber}
            courseTitle={courseTitle}
          />
        </div>
        {showUserDropdown && authenticatedUser && (
          <>
            <LearningHeaderActionsSlot />
            <KlmsUserMenu username={authenticatedUser.username} />
          </>
        )}
        {showUserDropdown && !authenticatedUser && <AnonymousUserMenu />}
      </div>
    </header>
  );
};

KlmsLearningHeader.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  showUserDropdown: PropTypes.bool,
};

KlmsLearningHeader.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
};

export default KlmsLearningHeader;
