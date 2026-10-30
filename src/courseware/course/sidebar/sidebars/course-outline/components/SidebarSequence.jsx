import { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible, Icon } from '@openedx/paragon';
import { CheckCircle, CheckCircleOutline, IncompleteCircle } from '@openedx/paragon/icons';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import { useChasiSequenceMark } from '@src/course-home/outline-tab/section-outline/ChasiProgress';
import { sequenceStatus } from '@src/course-home/outline-tab/section-outline/chasiMark';
import { useCourseOutlineSidebar } from '../hooks';
import CompletionIcon from './CompletionIcon';
import SidebarUnit from './SidebarUnit';
import { UNIT_ICON_TYPES } from './UnitIcon';

const SidebarSequence = ({
  courseId,
  defaultOpen,
  sequence,
  activeUnitId,
}) => {
  const intl = useIntl();
  const {
    id,
    complete,
    title,
    specialExamInfo,
    unitIds,
    type,
    completionStat,
  } = sequence;

  const [open, setOpen] = useState(defaultOpen);
  const { activeSequenceId, units, isEnabledCompletionTracking } = useCourseOutlineSidebar();
  const isActiveSequence = id === activeSequenceId;
  const mark = useChasiSequenceMark(id);
  const status = sequenceStatus(mark, complete);
  const label = {
    done: courseOutlineMessages.completedAssignment,
    progress: courseOutlineMessages.chasiInProgress,
    open: courseOutlineMessages.incompleteAssignment,
  }[status];
  const progressIcon = {
    done: CheckCircle,
    progress: IncompleteCircle,
    open: CheckCircleOutline,
  }[status];
  const progressClass = {
    done: 'text-success',
    progress: 'text-warning',
    open: 'text-gray-400',
  }[status];

  const sectionTitle = (
    <>
      <div className="col-auto p-0" style={{ fontSize: '1.1rem' }}>
        {mark === 'edx' ? (
          <CompletionIcon completionStat={completionStat} enabled={isEnabledCompletionTracking} />
        ) : (
          <Icon
            src={progressIcon}
            className={progressClass}
            size="sm"
            svgAttrs={{ 'aria-label': intl.formatMessage(label) }}
          />
        )}
      </div>
      <div className="col-9 d-flex flex-column flex-grow-1 ml-3 mr-auto p-0 text-left">
        <span className="align-middle text-dark-500">{title}</span>
        {specialExamInfo && <span className="align-middle small text-muted">{specialExamInfo}</span>}
        {(mark !== 'edx' || isEnabledCompletionTracking) && (
          <span className="sr-only">
            , {intl.formatMessage(label)}
          </span>
        )}
      </div>
    </>
  );

  return (
    <li>
      <Collapsible
        className={classNames('mb-2', { 'active-section': isActiveSequence, 'bg-info-100': isActiveSequence && !open })}
        styling="card-lg text-break"
        title={sectionTitle}
        open={open}
        onToggle={() => setOpen(!open)}
      >
        <ol className="list-unstyled">
          {unitIds.map((unitId, index) => (
            <SidebarUnit
              key={unitId}
              id={unitId}
              courseId={courseId}
              sequenceId={id}
              unit={units[unitId]}
              isActive={activeUnitId === unitId}
              activeUnitId={activeUnitId}
              isFirst={index === 0}
              isLocked={type === UNIT_ICON_TYPES.lock}
              isCompletionTrackingEnabled={isEnabledCompletionTracking}
            />
          ))}
        </ol>
      </Collapsible>
    </li>
  );
};

SidebarSequence.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  sequence: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    specialExamInfo: PropTypes.string,
    unitIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  activeUnitId: PropTypes.string.isRequired,
};

export default SidebarSequence;
