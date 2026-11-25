import koMessages from './ko.json';

// Atlas는 ko.json → 로케일 키 `ko`만 제공한다. 런타임 LANGUAGE_CODE는 ko-kr 이지만
// findSupportedLocale가 primary `ko`로 떨어진다. 희소 `ko-kr`을 등록하면 Atlas 전체
// 카탈로그를 가려 Previous/Next 등이 영문 defaultMessage로 돌아간다.
// 오버라이드는 Makefile에서 Atlas 메시지 배열 *뒤*에 붙여 merge 시 이긴다.
export default {
  ko: koMessages,
};
