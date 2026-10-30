import {
  createContext, useContext, useEffect, useState, ReactNode,
} from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { chasiMark, ChasiMark } from './chasiMark';

export interface ChasiRate {
  seconds: number;
  percent: string;
}

interface ChasiProgressValue {
  refund: boolean;
  rates: Record<string, ChasiRate>;
}

const EMPTY: ChasiProgressValue = { refund: false, rates: {} };

const ChasiProgressContext = createContext<ChasiProgressValue>(EMPTY);

export const useChasiProgress = (sequenceId: string): ChasiRate | undefined => (
  useContext(ChasiProgressContext).rates[sequenceId]
);

export const useRefundCourse = (): boolean => useContext(ChasiProgressContext).refund;

export const useChasiSequenceMark = (sequenceId: string): ChasiMark => {
  const refund = useRefundCourse();
  const chasi = useChasiProgress(sequenceId);
  return chasiMark(refund, chasi?.percent);
};

interface Props {
  courseId: string;
  children: ReactNode;
}

export const ChasiProgressProvider = ({ courseId, children }: Props) => {
  const [value, setValue] = useState<ChasiProgressValue>(EMPTY);

  useEffect(() => {
    if (!courseId) {
      setValue(EMPTY);
      return undefined;
    }
    let cancelled = false;
    const url = `${getConfig().LMS_BASE_URL}/klms/api/progress/chasi/?course_id=${encodeURIComponent(courseId)}`;
    getAuthenticatedHttpClient().get(url)
      .then(({ data }) => {
        if (!cancelled) {
          setValue({
            refund: Boolean(data?.refund),
            rates: data?.chasi || {},
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setValue(EMPTY);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return (
    <ChasiProgressContext.Provider value={value}>
      {children}
    </ChasiProgressContext.Provider>
  );
};
