import React from 'react';
import UsersRepository from 'lib/repositories/users-repository';
import 'components/Avatar/styles.scss';

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.userId = this.props.userId;
    this.repo = new UsersRepository(this.stateManager);
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
