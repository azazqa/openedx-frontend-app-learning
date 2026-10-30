import { getConfig } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import {
  initializeMockApp, render, screen, waitFor,
} from '../../../setupTest';
import { ChasiProgressProvider, useChasiProgress } from './ChasiProgress';

initializeMockApp();

const courseId = 'course-v1:org+course+run';
const sequenceId = 'block-v1:org+course+run+type@sequential+block@abc';

const Probe = () => {
  const chasi = useChasiProgress(sequenceId);
  if (!chasi) {
    return null;
  }
  return <div>{`${chasi.seconds} ${chasi.percent}`}</div>;
};

describe('ChasiProgressProvider', () => {
  let axiosMock;

  beforeEach(() => {
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it('keeps a rate below half the recognized time', async () => {
    axiosMock.onGet(`${getConfig().LMS_BASE_URL}/klms/api/progress/chasi/?course_id=${encodeURIComponent(courseId)}`)
      .reply(200, { [sequenceId]: { seconds: 27, percent: '1.3' } });
    render(
      <ChasiProgressProvider courseId={courseId}>
        <Probe />
      </ChasiProgressProvider>,
    );
    expect(await screen.findByText('27 1.3')).toBeInTheDocument();
  });

  it('renders nothing for the row when the request fails', async () => {
    axiosMock.onGet(`${getConfig().LMS_BASE_URL}/klms/api/progress/chasi/?course_id=${encodeURIComponent(courseId)}`)
      .reply(500);
    render(
      <ChasiProgressProvider courseId={courseId}>
        <Probe />
      </ChasiProgressProvider>,
    );
    await waitFor(() => expect(axiosMock.history.get.length).toBe(1));
    expect(screen.queryByText('27 1.3')).not.toBeInTheDocument();
  });
});
