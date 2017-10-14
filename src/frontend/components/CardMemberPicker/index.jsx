import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';
import 'components/CardMemberPicker/styles.scss';

export default class CardMemberPicker extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
      onMemberPicked: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.repo = this.deps.get('usersRepository');
  }

  userName(userId) {
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
            <li
              key={user.id}
              onClick={() => { onMemberPicked(user); }}
              className="member"
            >
              <Avatar
                className="avatar"
                userId={user.id}
                deps={this.deps}
              />
              {this.userName(user.id)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}