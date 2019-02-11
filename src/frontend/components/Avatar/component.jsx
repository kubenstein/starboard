import React from 'react';
import PropTypes from 'prop-types';
import placeholderAvatar from 'assets/images/avatar-placeholder.jpg';
import 'components/Avatar/styles.scss';

const Avatar = ({ userId, className, avatarUrl = placeholderAvatar }) => (
  <div
    title={userId}
    className={`avatar ${className}`}
    style={{ backgroundImage: `url('${avatarUrl}')` }}
  />
);

Avatar.propTypes = {
  userId: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  className: PropTypes.string,
};

export default Avatar;
