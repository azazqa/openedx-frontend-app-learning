import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  dashboard: {
    id: 'klms.header.userMenu.dashboard',
    defaultMessage: 'Dashboard',
    description: '사용자 메뉴의 대시보드 링크',
  },
  profile: {
    id: 'klms.header.userMenu.profile',
    defaultMessage: 'Profile',
    description: '사용자 메뉴의 프로필 링크',
  },
  account: {
    id: 'klms.header.userMenu.account',
    defaultMessage: 'Account',
    description: '사용자 메뉴의 계정 링크',
  },
  logout: {
    id: 'klms.header.userMenu.logout',
    defaultMessage: 'Sign out',
    description: '사용자 메뉴의 로그아웃 링크',
  },
  courses: {
    id: 'learnerVariantDashboard.course',
    defaultMessage: '강의',
    description: '상단 메뉴의 강의(내 강의실) 링크',
  },
  catalog: {
    id: 'klms.header.courses',
    defaultMessage: 'Catalog',
    description: 'Top menu link to the course catalog. Korean override is in the translation repository (klms.header.courses).',
  },
  signIn: {
    id: 'klms.header.anonymous.signIn',
    defaultMessage: 'Sign in',
    description: 'Header login button for anonymous users (registration CTA removed).',
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
