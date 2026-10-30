import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';

const CourseProgress = () => {
  const intl = useIntl();
  const courseId = useSelector(state => state.courseHome.courseId);
  const [status, setStatus] = useState('loading');
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const url = `${getConfig().LMS_BASE_URL}/klms/api/progress/`;
    getAuthenticatedHttpClient().get(url)
      .then(({ data }) => {
        if (cancelled) {
          return;
        }
        const parsed = Number(data?.[courseId]);
        setPercent(Number.isFinite(parsed) ? parsed : 0);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (status !== 'ready') {
    return null;
  }

  const width = Math.min(Math.max(percent, 0), 100);
  const label = `${percent.toFixed(1)}%`;
  const title = intl.formatMessage(messages.progressRate);

  return (
    <section className="mb-4" data-testid="CourseProgress">
      <h2 className="h4">{title}</h2>
      <div className="d-flex align-items-center">
        <span className="font-weight-bold mr-2">{label}</span>
        <div className="progress" style={{ height: 10, width: 200, maxWidth: 200 }}>
          <div
            className="progress-bar bg-success-700"
            role="progressbar"
            style={{ width: `${width}%` }}
            aria-valuenow={width}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={title}
          />
        </div>
      </div>
    </section>
  );
};

export default CourseProgress;
