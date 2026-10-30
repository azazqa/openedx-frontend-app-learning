import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Link } from 'react-router-dom';
import { Icon } from '@openedx/paragon';
import { CheckCircle, CheckCircleOutline, IncompleteCircle } from '@openedx/paragon/icons';

import EffortEstimate from '../../../shared/effort-estimate';
import messages from '../messages';
import { useContextId } from '../../../data/hooks';
import { useChasiSequenceMark } from './ChasiProgress';
import { sequenceStatus } from './chasiMark';

interface Props {
  complete: boolean;
  showLink: boolean;
  title: string;
  sequence: object;
  id: string;
}

const SequenceTitle: React.FC<Props> = ({
  complete,
  showLink,
  title,
  sequence,
  id,
}) => {
  const intl = useIntl();
  const courseId = useContextId();
  const coursewareUrl = <Link to={`/course/${courseId}/${id}`}>{title}</Link>;
  const displayTitle = showLink ? coursewareUrl : title;
  const status = sequenceStatus(useChasiSequenceMark(id), complete);
  const label = {
    done: messages.completedAssignment,
    progress: messages.chasiInProgress,
    open: messages.incompleteAssignment,
  }[status];
  const icon = {
    done: CheckCircle,
    progress: IncompleteCircle,
    open: CheckCircleOutline,
  }[status];
  const iconClass = {
    done: 'float-left text-success mt-1',
    progress: 'float-left text-warning mt-1',
    open: 'float-left text-gray-400 mt-1',
  }[status];

  return (
    <div className="row w-100 m-0">
      <div className="col-auto p-0">
        <Icon
          src={icon}
          className={iconClass}
          aria-hidden={status === 'done'}
          svgAttrs={{ 'aria-label': intl.formatMessage(label) }}
          size="sm"
        />
      </div>
      <div className="col-10 p-0 ml-3 text-break">
        <span className="align-middle">{displayTitle}</span>
        <span className="sr-only">
          , {intl.formatMessage(label)}
        </span>
        <EffortEstimate className="ml-3 align-middle" block={sequence} />
      </div>
    </div>
  );
};

export default SequenceTitle;
