import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';
import FunctionLink from 'components/FunctionLink';
import 'components/CardMemberPicker/styles.scss';

export default class CardMemberPicker extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
    onMemberPicked: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.repo = this.deps.get('usersRepository');
  }

  renderUserName(userId) {
    return this.repo.userNickname(userId) || userId;
  }

  render() {
    const { onMemberPicked, className = '' } = this.props;
    const users = this.repo.all();
    return (
      <div className={`card-member-picker ${className}`}>
        <h1 className="header">Add a member to the card:</h1>
        <ul className="members">
          { users.map(user => (
            <FunctionLink
              component="li"
              key={user.id}
              onClick={() => onMemberPicked(user)}
              className="member"
            >
              <Avatar
                className="avatar"
                userId={user.id}
                deps={this.deps}
              />
              {this.renderUserName(user.id)}
            </FunctionLink>
          ))}
        </ul>
      </div>
    );
  }
}
