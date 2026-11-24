import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { Dropdown } from '@openedx/paragon';
import LogoSlot from '@edx/frontend-component-header/dist/plugin-slots/LogoSlot';
import HeaderNotificationsSlot from '@edx/frontend-component-header/dist/plugin-slots/HeaderNotificationsSlot';
import LearningLoggedOutItemsSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningLoggedOutItemsSlot';
import LearningUserMenuToggleSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningUserMenuToggleSlot';
import LearningUserMenuSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningUserMenuSlot';

import messages from './messages';

/** Login only — no account registration CTA. */
const KlmsAnonymousUserMenu = () => {
  const intl = useIntl();
  const buttonsInfo = [{
    message: intl.formatMessage(messages.signIn),
    href: getLoginRedirectUrl(global.location.href),
    variant: 'primary',
  }];
  return <LearningLoggedOutItemsSlot buttonsInfo={buttonsInfo} />;
};

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

/**
 * KLMS: 로고 옆 과정 코드·과정명 대신 대시보드/카탈로그와 같은 「강의」「과정」 메뉴를 둡니다.
 */
const KlmsLearningHeader = ({ showUserDropdown }) => {
  const intl = useIntl();
  const { authenticatedUser } = useContext(AppContext);
  const config = getConfig();
  const catalogOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const mainMenu = [
    {
      key: 'courses',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages.courses),
    },
    {
      key: 'catalog',
      href: `${catalogOrigin}/catalog/courses`,
      content: intl.formatMessage(messages.catalog),
    },
  ];

  return (
    <header className="learning-header">
      <a className="sr-only sr-only-focusable" href="#main-content">
        {intl.formatMessage(messages.skipNavLink)}
      </a>
      <div className="container-xl py-2 d-flex align-items-center">
        <LogoSlot
          href={`${config.LMS_BASE_URL}/dashboard`}
          src={config.LOGO_URL}
          alt={config.SITE_NAME}
        />
        <nav className="nav flex-grow-1 align-items-center" aria-label="main">
          {mainMenu.map((item) => (
            <a key={item.key} className="nav-link" href={item.href}>
              {item.content}
            </a>
          ))}
        </nav>
        {showUserDropdown && authenticatedUser && (
          <>
            <HeaderNotificationsSlot />
            <KlmsUserMenu username={authenticatedUser.username} />
          </>
        )}
        {showUserDropdown && !authenticatedUser && <KlmsAnonymousUserMenu />}
      </div>
    </header>
  );
};

KlmsLearningHeader.propTypes = {
  showUserDropdown: PropTypes.bool,
};

KlmsLearningHeader.defaultProps = {
  showUserDropdown: true,
};

export default KlmsLearningHeader;
