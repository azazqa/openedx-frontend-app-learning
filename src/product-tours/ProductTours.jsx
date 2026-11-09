import PropTypes from 'prop-types';

/**
 * KLMS: 과정 최초 진입 환영·투어(NewUserCourseHomeTourModal 등)를 쓰지 않습니다.
 * 상위는 그대로 ProductTours 를 마운트하므로 props 시그니처만 유지합니다.
 */
const ProductTours = () => null;

ProductTours.propTypes = {
  activeTab: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  isStreakCelebrationOpen: PropTypes.bool.isRequired,
  org: PropTypes.string.isRequired,
};

export default ProductTours;
