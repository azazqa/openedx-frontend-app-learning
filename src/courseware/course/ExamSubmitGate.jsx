import { useCallback, useEffect, useRef, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { messageTypes } from './sequence/Unit/constants';

const HINT_ID = 'klms-exam-submit-hint';
const JUMP_ID = 'klms-exam-jump-link';
const END_BTN_SEL = '[data-testid="end-button"], [data-testid="end-exam-button"]';
const OBSERVE_OPTS = { childList: true, subtree: true };

/**
 * iframe 이 보낸 문항 제출 상태로 시험 종료를 가로챕니다.
 * 미제출이면 종료를 막고 문항 번호를 안내합니다.
 * 숨긴 안내 문구의 시험 링크(exam_url_path)를 「시험 이동」으로 종료 버튼 왼쪽에 복원합니다.
 * 제한 시간 만료 자동 제출은 막지 않습니다.
 *
 * MutationObserver 가 textContent/속성 재할당으로 자기 자신을 다시 깨우지 않도록
 * 값이 바뀔 때만 DOM 을 쓰고, 콜백 중에는 observer 를 잠시 끕니다.
 */
const ExamSubmitGate = () => {
  const intl = useIntl();
  const [allSubmitted, setAllSubmitted] = useState(null);
  const [missingNumbers, setMissingNumbers] = useState([]);
  const missingRef = useRef([]);

  const jumpLabel = intl.formatMessage({
    id: 'klms.exam.jumpToExam',
    defaultMessage: '시험 이동',
  });

  const formatMissingList = useCallback((numbers) => (
    (numbers || []).map((n) => `${n}번`).join(', ')
  ), []);

  const hintText = useCallback((numbers) => {
    const base = intl.formatMessage({
      id: 'klms.exam.submitGate.hint',
      defaultMessage: '모든 문항을 제출한 뒤에 시험을 마칠 수 있습니다.',
    });
    if (!numbers || numbers.length === 0) {
      return base;
    }
    const missing = intl.formatMessage(
      {
        id: 'klms.exam.submitGate.missing',
        defaultMessage: '미제출: {numbers}',
      },
      { numbers: formatMissingList(numbers) },
    );
    return `${base} (${missing})`;
  }, [formatMissingList, intl]);

  const alertText = useCallback((numbers) => (
    intl.formatMessage(
      {
        id: 'klms.exam.submitGate.missingAlert',
        defaultMessage: '미제출 문항: {numbers}',
      },
      { numbers: formatMissingList(numbers) },
    )
  ), [formatMissingList, intl]);

  const ensureJumpLink = useCallback(() => {
    document.querySelectorAll('[data-testid="exam-timer"]').forEach((timer) => {
      const source = timer.querySelector(':scope > div:first-child a[href]');
      const endBtn = timer.querySelector(END_BTN_SEL);
      if (!source || !endBtn || !endBtn.parentNode) {
        return;
      }
      const href = source.getAttribute('href');
      if (!href) {
        return;
      }
      let link = timer.querySelector(`#${JUMP_ID}`);
      if (!link) {
        link = document.createElement('a');
        link.id = JUMP_ID;
        link.className = 'klms-exam-jump-link';
        endBtn.parentNode.insertBefore(link, endBtn);
      }
      if (link.getAttribute('href') !== href) {
        link.setAttribute('href', href);
      }
      if (link.textContent !== jumpLabel) {
        link.textContent = jumpLabel;
      }
    });
  }, [jumpLabel]);

  const clearEndButtonLock = useCallback(() => {
    document.querySelectorAll(END_BTN_SEL).forEach((button) => {
      if (button.hasAttribute('disabled')) {
        button.removeAttribute('disabled');
      }
      if (button.classList.contains('disabled')) {
        button.classList.remove('disabled');
      }
      if (button.getAttribute('aria-disabled') === 'true') {
        button.setAttribute('aria-disabled', 'false');
      }
    });
  }, []);

  const applyGate = useCallback((ready, numbers) => {
    clearEndButtonLock();

    const timers = document.querySelectorAll('[data-testid="exam-timer"]');
    const text = hintText(numbers);
    timers.forEach((timer) => {
      let hint = timer.querySelector(`#${HINT_ID}`);
      if (ready) {
        if (hint) {
          hint.remove();
        }
        return;
      }
      if (!hint) {
        hint = document.createElement('p');
        hint.id = HINT_ID;
        hint.className = 'klms-exam-submit-hint';
        hint.setAttribute('role', 'status');
        timer.appendChild(hint);
      }
      if (hint.textContent !== text) {
        hint.textContent = text;
      }
    });
  }, [clearEndButtonLock, hintText]);

  useEffect(() => {
    let lmsOrigin = '';
    try {
      lmsOrigin = new URL(getConfig().LMS_BASE_URL).origin;
    } catch (err) {
      lmsOrigin = getConfig().LMS_BASE_URL || '';
    }
    const onMessage = (event) => {
      if (lmsOrigin && event.origin !== lmsOrigin) {
        return;
      }
      const { type, payload } = event.data || {};
      if (type !== messageTypes.examProblemsStatus) {
        return;
      }
      const missing = Array.isArray(payload?.missingNumbers)
        ? payload.missingNumbers.filter((n) => Number.isFinite(Number(n))).map(Number)
        : [];
      const ready = Boolean(payload && payload.allSubmitted);
      missingRef.current = missing;
      setMissingNumbers(missing);
      setAllSubmitted(ready);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    const onClickCapture = (event) => {
      const button = event.target.closest && event.target.closest(END_BTN_SEL);
      if (!button) {
        return;
      }
      const missing = missingRef.current || [];
      if (missing.length === 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      window.alert(alertText(missing));
    };
    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, [alertText]);

  useEffect(() => {
    const run = () => {
      observer.disconnect();
      try {
        ensureJumpLink();
      } finally {
        observer.observe(document.body, OBSERVE_OPTS);
      }
    };
    const observer = new MutationObserver(run);
    ensureJumpLink();
    observer.observe(document.body, OBSERVE_OPTS);
    return () => observer.disconnect();
  }, [ensureJumpLink]);

  useEffect(() => {
    if (allSubmitted === null) {
      return undefined;
    }
    const run = () => {
      observer.disconnect();
      try {
        applyGate(allSubmitted, missingNumbers);
      } finally {
        observer.observe(document.body, OBSERVE_OPTS);
      }
    };
    const observer = new MutationObserver(run);
    applyGate(allSubmitted, missingNumbers);
    observer.observe(document.body, OBSERVE_OPTS);
    return () => observer.disconnect();
  }, [allSubmitted, missingNumbers, applyGate]);

  return null;
};

export default ExamSubmitGate;
