import { getConfig } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useSelector } from 'react-redux';

import {
  initializeMockApp, render, screen, waitFor,
} from '../../../setupTest';
import CourseProgress from './CourseProgress';

initializeMockApp();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const courseId = 'course-v1:org+course+run';

describe('CourseProgress', () => {
  let axiosMock;

  beforeEach(() => {
    useSelector.mockImplementation(selector => selector({ courseHome: { courseId } }));
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it('shows the course rate to one decimal and fills the bar', async () => {
    axiosMock.onGet(`${getConfig().LMS_BASE_URL}/klms/api/progress/`).reply(200, { [courseId]: '12.5' });
    render(<CourseProgress />);
    expect(await screen.findByText('12.5%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar').style.width).toBe('12.5%');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '12.5');
    expect(screen.getByRole('heading', { name: '진도율' })).toBeInTheDocument();
  });

  it('shows 0.0% when the course has no rate', async () => {
    axiosMock.onGet(`${getConfig().LMS_BASE_URL}/klms/api/progress/`).reply(200, {});
    render(<CourseProgress />);
    expect(await screen.findByText('0.0%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar').style.width).toBe('0%');
  });

  it('renders nothing when the request fails', async () => {
    axiosMock.onGet(`${getConfig().LMS_BASE_URL}/klms/api/progress/`).reply(500);
    render(<CourseProgress />);
    await waitFor(() => expect(axiosMock.history.get.length).toBe(1));
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
