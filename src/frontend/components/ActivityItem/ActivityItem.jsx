import React from 'react';
import UsersRepository from 'lib/users-repository.js';
import { formattedDate } from 'lib/utils.js';
import 'components/ActivityItem/activity-item.scss';

export default class ActivityItem extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.usersRepo = new UsersRepository(this.stateManager);
    this.event = this.props.event;
  }

  author() {
    const id = this.event.requesterId;
    return this.usersRepo.userNickname(id) || id;
  }

  content() {
    const type = this.event.type.replace('_', '');
    const handler = this[`${type}ActivityHtml`];
    return handler ? handler.bind(this)() : '';
  }

  // handlers

  CARDADDEDActivityHtml() {
    const title = this.event.data.title;
    return `${this.author()} added '${title}' card.`;
  }

  CARDREMOVEDActivityHtml() {
  }

  COLUMNADDEDActivityHtml() {
  }

  COLUMNREMOVEDActivityHtml() {
  }

  COMMENTADDEDActivityHtml() {
  }

  SETTINGSUPDATEDActivityHtml() {
  }

  CARDLABELUPDATEDActivityHtml() {
  }

  render() {
    const date = formattedDate(this.event.createdAt);
    const content = this.content();
    return (
      <div className="activity-item">
        <small className="date">{date}</small>
        <p className="content">{content}</p>
      </div>
    );
  }
}
