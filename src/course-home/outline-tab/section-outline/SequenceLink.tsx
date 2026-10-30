import React from 'react';
import classNames from 'classnames';

import SequenceDueDate from './SequenceDueDate';
import HiddenSequenceLink from './HiddenSequenceLink';
import SequenceTitle from './SequenceTitle';
import { useChasiProgress } from './ChasiProgress';
import { formatStudyTime } from './formatStudyTime';

interface Props {
  id: string;
  first: boolean;
  sequence: {
    complete: boolean;
    description: string;
    due: string;
    showLink: boolean;
    title: string;
    hideFromTOC: boolean;
  }
}

const SequenceLink: React.FC<Props> = ({
  id,
  first,
  sequence,
}) => {
  const {
    complete,
    description,
    due,
    showLink,
    title,
    hideFromTOC,
  } = sequence;
  const chasi = useChasiProgress(id);

  return (
    <li>
      <div className={classNames('', { 'mt-2 pt-2 border-top border-light': !first })}>
        <SequenceTitle
          {...{
            complete,
            showLink,
            title,
            sequence,
            id,
          }}
        />
        {hideFromTOC && (
          <HiddenSequenceLink />
        )}
        {chasi && (
          <div className="small text-gray-700 mt-1 ml-4" data-testid="chasi-study">
            {formatStudyTime(chasi.seconds)}
            {' · '}
            {chasi.percent}
            %
          </div>
        )}
        <SequenceDueDate {...{ due, id, description }} />
      </div>
    </li>
  );
};

export default SequenceLink;
