import React from 'react';
import PropTypes from 'prop-types';
import UsersRepository from 'lib/repositories/users-repository';
import 'components/Avatar/styles.scss';

export default class Avatar extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired,
      userId: PropTypes.string.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { stateManager } = this.props;
    this.repo = new UsersRepository(stateManager);
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
