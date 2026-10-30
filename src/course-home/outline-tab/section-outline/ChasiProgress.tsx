import {
  createContext, useContext, useEffect, useState, ReactNode,
} from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export interface ChasiRate {
  seconds: number;
  percent: string;
}

const ChasiProgressContext = createContext<Record<string, ChasiRate>>({});

export const useChasiProgress = (sequenceId: string): ChasiRate | undefined => (
  useContext(ChasiProgressContext)[sequenceId]
);

interface Props {
  courseId: string;
  children: ReactNode;
}

export const ChasiProgressProvider = ({ courseId, children }: Props) => {
  const [rates, setRates] = useState<Record<string, ChasiRate>>({});

  useEffect(() => {
    if (!courseId) {
      setRates({});
      return undefined;
    }
    let cancelled = false;
    const url = `${getConfig().LMS_BASE_URL}/klms/api/progress/chasi/?course_id=${encodeURIComponent(courseId)}`;
    getAuthenticatedHttpClient().get(url)
      .then(({ data }) => {
        if (!cancelled) {
          setRates(data || {});
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRates({});
        }
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <ChasiProgressContext.Provider value={rates}>
      {children}
    </ChasiProgressContext.Provider>
  );
};
