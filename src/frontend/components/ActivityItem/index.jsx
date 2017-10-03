import React from 'react';
import PropTypes from 'prop-types';
import UsersRepository from 'lib/repositories/users-repository';
import SettingsRepository from 'lib/repositories/settings-repository';
import { formattedDate } from 'lib/utils';
import 'components/ActivityItem/styles.scss';

export default class ActivityItem extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired,
      activity: PropTypes.object.isRequired, // TODO change to shape
    };
  }

  constructor(props) {
    super(props);
    const { stateManager } = this.props;
    this.activity = this.props.activity;
    this.usersRepo = new UsersRepository(stateManager);
    this.settingsRepo = new SettingsRepository(stateManager);
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
    const author = this.author();
    return (
      <div className="activity-item">
        <small className="date">{date}</small>
        <small className="author">{author} </small>
        <span className="content">{content}</span>
      </div>
    );
  }
}
