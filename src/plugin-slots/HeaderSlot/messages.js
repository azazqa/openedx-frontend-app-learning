import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  dashboard: {
    id: 'klms.header.userMenu.dashboard',
    defaultMessage: '대시보드',
    description: '사용자 메뉴의 대시보드 링크',
  },
  profile: {
    id: 'klms.header.userMenu.profile',
    defaultMessage: '프로필',
    description: '사용자 메뉴의 프로필 링크',
  },
  account: {
    id: 'klms.header.userMenu.account',
    defaultMessage: '계정',
    description: '사용자 메뉴의 계정 링크',
  },
  logout: {
    id: 'klms.header.userMenu.logout',
    defaultMessage: '로그아웃',
    description: '사용자 메뉴의 로그아웃 링크',
  },
  skipNavLink: {
    id: 'header.navigation.skipNavLink',
    defaultMessage: 'Skip to main content.',
    description: 'A link used by screen readers to allow users to skip to the main content of the page.',
  },
  userOptionsDropdownLabel: {
    id: 'header.menu.aria-label',
    defaultMessage: 'User Options',
    description: 'The aria-label for the user options dropdown.',
  },
});

export default messages;
