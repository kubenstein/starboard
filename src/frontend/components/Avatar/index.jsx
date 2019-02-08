import React from 'react';
import PropTypes from 'prop-types';
import placeholderAvatar from 'assets/images/avatar-placeholder.jpg';
import 'components/Avatar/styles.scss';

export default class Avatar extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    className: PropTypes.string,
  }

  constructor(props) {
    super(props);
    const { deps } = this.props;
    this.repo = deps.get('usersRepository');
  }

  render() {
    const { userId, className } = this.props;
    const avatarUrl = this.repo.userAvatarUrl(userId) || placeholderAvatar;

    return (
      <div
        title={userId}
        className={`avatar ${className}`}
        style={{ backgroundImage: `url('${avatarUrl}')` }}
      />
    );
  }
}
