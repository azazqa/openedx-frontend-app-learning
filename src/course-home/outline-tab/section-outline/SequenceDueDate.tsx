import React from 'react';
import { FormattedTime, useIntl } from '@edx/frontend-platform/i18n';
import { useModel } from '../../../generic/model-store';

import { useContextId } from '../../../data/hooks';
import messages from '../messages';
import { useChasiProgress } from './ChasiProgress';
import { formatStudyTime } from './formatStudyTime';
import localizeOutlineText from './localizeOutlineText';

interface Props {
  due: string;
  id: string;
  description: string;
}

const SequenceDueDate: React.FC<Props> = ({
  due,
  id,
  description,
}) => {
  const intl = useIntl();
  const courseId = useContextId();
  const chasi = useChasiProgress(id);
  const localizedDescription = localizeOutlineText(description, intl.formatMessage);
  let dueDateMessage: string | React.ReactNode = intl.formatMessage(
    messages.sequenceNoDueDate,
    { description: localizedDescription },
  );
  const {
    userTimezone,
  } = useModel('outline', courseId);

  if (due) {
    const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

    dueDateMessage = intl.formatMessage(
      messages.sequenceDueDate,
      {
        assignmentDue: (
          <FormattedTime
            key={`${id}-due`}
            day="numeric"
            month="short"
            year="numeric"
            value={due}
            {...timezoneFormatArgs}
          />
        ),
        description: localizedDescription,
      },
    );
  }

  return (
    <div className="row w-100 m-0 ml-3 pl-3 align-items-baseline">
      {chasi && (
        <span data-testid="chasi-study">
          {formatStudyTime(chasi.seconds, intl.formatMessage)}
          {' · '}
          {chasi.percent}
          %
        </span>
      )}
      <small className="text-body pl-2">
        {dueDateMessage}
      </small>
    </div>
  );
};

export default SequenceDueDate;
