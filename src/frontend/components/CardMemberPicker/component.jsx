import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';
import FunctionLink from 'components/FunctionLink';
import 'components/CardMemberPicker/styles.scss';

const CardMemberPicker = ({ onChange, className, nickname, users }) => (
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

CardMemberPicker.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  nickname: PropTypes.func.isRequired,
};

export default CardMemberPicker;
