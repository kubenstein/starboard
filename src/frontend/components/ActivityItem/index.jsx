import React from 'react';
import PropTypes from 'prop-types';
import { formattedDate } from 'lib/utils';
import 'components/ActivityItem/styles.scss';

export default class ActivityItem extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
      activity: PropTypes.object.isRequired, // TODO change to shape
    };
  }

  constructor(props) {
    super(props);
    const deps = this.props.deps;
    this.usersRepo = deps.get('usersRepository');
    this.settingsRepo = deps.get('settingsRepository');
  }

  author(activity) {
    const { requesterId } = activity;
    return this.usersRepo.userNickname(requesterId) || requesterId;
  }

  content(activity) {
    const type = activity.type.replace(/_/g, '');
    const handler = this[`${type}ActivityHtml`];
    return handler ? handler.bind(this)(activity) : '';
  }

  // handlers

  CARDADDEDActivityHtml(activity) {
    const { cardTitle } = activity.meta;
    return <span>added card <i>{cardTitle}</i>.</span>;
  }

  CARDREMOVEDActivityHtml(activity) {
    const { cardTitle } = activity.meta;
    return <span>removed card <i>{cardTitle}</i>.</span>;
  }

  CARDLABELUPDATEDActivityHtml(activity) {
    const { label, set } = activity.data;
    const { cardTitle } = activity.meta;
    const labelName = this.settingsRepo.textForLabel(label, true);
    return <span>
      {set ? 'set' : 'removed'} label: <i>{labelName}</i> {set ? 'to' : 'from'} card <i>{cardTitle}</i>.
    </span>;
  }

  COMMENTADDEDActivityHtml(activity) {
    const { content } = activity.data;
    const { cardTitle } = activity.meta;
    return <span>
      added comment: <br /> <i>&quot;{content}&quot;</i> <br /> to card <i>{cardTitle}</i>.
    </span>;
  }

  COLUMNADDEDActivityHtml(activity) {
    const { columnName } = activity.meta;
    return <span>added column <i>{columnName}</i>.</span>;
  }

  COLUMNREMOVEDActivityHtml(activity) {
    const { columnName } = activity.meta;
    return <span>removed column <i>{columnName}</i>.</span>;
  }

  render() {
    const { activity } = this.props;
    const date = formattedDate(activity.createdAt);
    const content = this.content(activity);
    const author = this.author(activity);
    return (
      <div className="activity-item">
        <small className="date">{date}</small>
        <small className="author">{author} </small>
        <span className="content">{content}</span>
      </div>
    );
  }
}
