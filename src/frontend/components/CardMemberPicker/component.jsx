import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';
import FunctionLink from 'components/FunctionLink';
import 'components/CardMemberPicker/styles.scss';

export default class CardMemberPicker extends React.Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    nickname: PropTypes.func.isRequired,
  }

  render() {
    const { onChange, className, nickname, users } = this.props;
    return (
      <div className={`card-member-picker ${className}`}>
        <h1 className="header">Add a member to the card:</h1>
        <ul className="members">
          { users.map(user => (
            <FunctionLink
              component="li"
              key={user.id}
              onClick={() => onChange(user)}
              className="member"
            >
              <Avatar
                className="avatar"
                userId={user.id}
              />
              {nickname(user.id) || user.id}
            </FunctionLink>
          ))}
        </ul>
      </div>
    );
  }
}
