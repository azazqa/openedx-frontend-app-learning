import { useCallback, useEffect, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { messageTypes } from './sequence/Unit/constants';

const HINT_ID = 'klms-exam-submit-hint';

/**
 * iframe 이 보낸 문항 제출 상태로 시험 종료 버튼을 잠급니다.
 * 제한 시간 만료 자동 제출은 막지 않습니다.
 */
const ExamSubmitGate = () => {
  const intl = useIntl();
  const [allSubmitted, setAllSubmitted] = useState(null);

  const applyGate = useCallback((ready) => {
    const buttons = document.querySelectorAll(
      '[data-testid="end-button"], [data-testid="end-exam-button"]',
    );
    buttons.forEach((button) => {
      if (ready) {
        button.removeAttribute('disabled');
        button.classList.remove('disabled');
        button.setAttribute('aria-disabled', 'false');
      } else {
        button.setAttribute('disabled', 'disabled');
        button.classList.add('disabled');
        button.setAttribute('aria-disabled', 'true');
      }
    });

    const timers = document.querySelectorAll('[data-testid="exam-timer"]');
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
      hint.textContent = intl.formatMessage({
        id: 'klms.exam.submitGate.hint',
        defaultMessage: '모든 문항을 제출한 뒤에 시험을 마칠 수 있습니다.',
      });
    });
  }, [intl]);

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
      setAllSubmitted(Boolean(payload && payload.allSubmitted));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (allSubmitted === null) {
      return undefined;
    }
    applyGate(allSubmitted);
    const observer = new MutationObserver(() => applyGate(allSubmitted));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [allSubmitted, applyGate]);

  return null;
};

export default ExamSubmitGate;
