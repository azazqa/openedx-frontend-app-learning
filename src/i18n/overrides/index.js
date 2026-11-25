import koMessages from './ko.json';

// Atlas·런타임 로케일은 ko-kr. ko 만 두면 Atlas ko-kr 이 우선해 오버라이드가 무시된다.
export default {
  ko: koMessages,
  'ko-kr': koMessages,
};
