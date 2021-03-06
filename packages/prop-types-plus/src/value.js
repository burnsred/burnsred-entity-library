import PropTypes from 'prop-types';
import PropTypesImmutable from 'react-immutable-proptypes';

export default PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
  PropTypesImmutable.list,
  PropTypesImmutable.map,
  PropTypes.any, // TODO remove and allow moment, bool etc..
]);
