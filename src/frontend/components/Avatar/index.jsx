import React from 'react';
import PropTypes from 'prop-types';
import 'components/Avatar/styles.scss';

export default class Avatar extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
      userId: PropTypes.string.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { deps } = this.props;
    this.repo = deps.get('usersRepository');
  }

  render() {
    const { userId } = this.props;
    const avatarUrl = this.repo.userAvatarUrl(userId);

    if (!avatarUrl) return null;

    return (
      <div
        className="avatar"
        style={{ backgroundImage: `url('${avatarUrl}')` }}
      />
    );
  }
}
