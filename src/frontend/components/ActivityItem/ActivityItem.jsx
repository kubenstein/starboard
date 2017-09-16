import React from 'react';
import UsersRepository from 'lib/users-repository.js';
import SettingsRepository from 'lib/settings-repository.js';
import { formattedDate } from 'lib/utils.js';
import 'components/ActivityItem/styles.scss';

export default class ActivityItem extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.usersRepo = new UsersRepository(this.stateManager);
    this.settingsRepo = new SettingsRepository(this.stateManager);
    this.activity = this.props.activity;
  }

  author() {
    const id = this.activity.requesterId;
    return this.usersRepo.userNickname(id) || id;
  }

  content() {
    const type = this.activity.type.replace(/_/g, '');
    const handler = this[`${type}ActivityHtml`];
    return handler ? handler.bind(this)() : '';
  }

  // handlers

  CARDADDEDActivityHtml() {
    const { cardTitle } = this.activity.meta;
    return <span>added card <i>{cardTitle}</i>.</span>;
  }

  CARDREMOVEDActivityHtml() {
    const { cardTitle } = this.activity.meta;
    return <span>removed card <i>{cardTitle}</i>.</span>;
  }

  CARDLABELUPDATEDActivityHtml() {
    const { label, set } = this.activity.data;
    const { cardTitle } = this.activity.meta;
    const labelName = this.settingsRepo.textForLabel(label, true);
    return <span>
      {set ? 'set' : 'removed'} label: <i>{labelName}</i> {set ? 'to' : 'from'} card <i>{cardTitle}</i>.
    </span>;
  }

  COMMENTADDEDActivityHtml() {
    const { content } = this.activity.data;
    const { cardTitle } = this.activity.meta;
    return <span>
      added comment: <br /> <i>&quot;{content}&quot;</i> <br /> to card <i>{cardTitle}</i>.
    </span>;
  }

  COLUMNADDEDActivityHtml() {
    const { columnName } = this.activity.meta;
    return <span>added column <i>{columnName}</i>.</span>;
  }

  COLUMNREMOVEDActivityHtml() {
    const { columnName } = this.activity.meta;
    return <span>removed column <i>{columnName}</i>.</span>;
  }

  render() {
    const date = formattedDate(this.activity.createdAt);
    const content = this.content();
    return (
      <div className="activity-item">
        <small className="date">{date}</small>
        <small className="author">{this.author()} </small>
        <span className="content">{content}</span>
      </div>
    );
  }
}
