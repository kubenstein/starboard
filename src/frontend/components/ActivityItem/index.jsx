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
    this.cardsRepo = deps.get('cardsRepository');
    this.settingsRepo = deps.get('settingsRepository');
    this.uiRepo = deps.get('uiRepository');
  }

  openCard(cardId) {
    this.uiRepo.set('card:openedId', cardId);
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
    const { id } = activity.data;
    const { cardTitle } = activity.meta;
    return (
      <span>
      added card&nbsp;
        {this.cardLink(id, cardTitle)}
      </span>
    );
  }

  CARDREMOVEDActivityHtml(activity) {
    const { id } = activity.data;
    const { cardTitle } = activity.meta;
    return (
      <span>
        removed card&nbsp;
        {this.cardLink(id, cardTitle)}
      </span>
    );
  }

  CARDLABELUPDATEDActivityHtml(activity) {
    const { label, set, cardId } = activity.data;
    const { cardTitle } = activity.meta;
    const labelName = this.settingsRepo.textForLabel(label, true);
    return (
      <span>
        {set ? 'set' : 'removed'} label: <i>{labelName} </i>
        {set ? 'to' : 'from'} card&nbsp;
        {this.cardLink(cardId, cardTitle)}
      </span>
    );
  }

  COMMENTADDEDActivityHtml(activity) {
    const { content, attachment, cardId } = activity.data;
    const { cardTitle } = activity.meta;

    return (
      <span>
        { attachment ?
          <span>added attachment: <br /> <i>&quot;{attachment.name}&quot;</i></span>
        :
          <span>added comment: <br /> <i>&quot;{content}&quot;</i></span>
        }
        <br />
        to card&nbsp;
        {this.cardLink(cardId, cardTitle)}
      </span>
    );
  }

  COLUMNADDEDActivityHtml(activity) {
    const { columnName } = activity.meta;
    return <span>added column <i>{columnName}</i>.</span>;
  }

  COLUMNREMOVEDActivityHtml(activity) {
    const { columnName } = activity.meta;
    return <span>removed column <i>{columnName}</i>.</span>;
  }

  cardLink(cardId, cardTitle) {
    return (
    this.cardsRepo.cardExists(cardId) ?
      <a className="link" onClick={() => this.openCard(cardId)}>{cardTitle}.</a>
    :
      <span className="link item-removed-link">{cardTitle} (removed).</span>
    );
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
