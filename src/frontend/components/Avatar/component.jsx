import React from 'react';
import PropTypes from 'prop-types';
import placeholderAvatar from 'assets/images/avatar-placeholder.jpg';
import 'components/Avatar/styles.scss';

export default class Avatar extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    className: PropTypes.string,
  }

  render() {
    const { userId, className, avatarUrl = placeholderAvatar } = this.props;

    return (
      <div
        title={userId}
        className={`avatar ${className}`}
        style={{ backgroundImage: `url('${avatarUrl}')` }}
      />
    );
  }
}
