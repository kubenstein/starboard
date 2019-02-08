import React from 'react';
import PropTypes from 'prop-types';
import FunctionLink from 'components/FunctionLink';
import { formattedDate } from 'lib/utils';
import 'components/ActivityItem/styles.scss';

export default class ActivityItem extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
    activity: PropTypes.object.isRequired, // TODO change to shape
  }

  constructor(props) {
    super(props);
    const deps = this.props.deps;
    this.usersRepo = deps.get('usersRepository');
    this.cardsRepo = deps.get('cardsRepository');
    this.settingsRepo = deps.get('settingsRepository');
    this.uiRepo = deps.get('uiRepository');
  }

  openCard = (cardId) => {
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
    const { data: { id }, meta: { cardTitle } } = activity;
    return (
      <span>
        added card&nbsp;
        {this.cardLink(id, cardTitle)}
      </span>
    );
  }

  CARDREMOVEDActivityHtml(activity) {
    const { data: { id }, meta: { cardTitle } } = activity;
    return (
      <span>
        removed card&nbsp;
        {this.cardLink(id, cardTitle)}
      </span>
    );
  }

  CARDLABELUPDATEDActivityHtml(activity) {
    const { data: { label, set, cardId }, meta: { cardTitle } } = activity;
    const labelName = this.settingsRepo.textForLabel(label, true);
    return (
      <span>
        {set ? 'set label:' : 'removed label:'}
        <i>{labelName}</i>
        {set ? ' to card' : ' from card'}
        &nbsp;
        {this.cardLink(cardId, cardTitle)}
      </span>
    );
  }

  CARDMEMBERUPDATEDActivityHtml(activity) {
    const { data: { userId: memberId, set, cardId }, meta: { cardTitle } } = activity;
    const memberName = this.usersRepo.userNickname(memberId) || memberId;
    return (
      <span>
        {set ? 'assigned ' : 'unassigned '}
        <i>{memberName}</i>
        {set ? ' to ' : ' from '}
        card&nbsp;
        {this.cardLink(cardId, cardTitle)}
      </span>
    );
  }

  COMMENTADDEDActivityHtml(activity) {
    const { data: { content, attachment, cardId }, meta: { cardTitle } } = activity;

    return (
      <span>
        { attachment ? (
          <span>
            added attachment:
            <br />
            <i>{`&quot;${attachment.name}&quot;`}</i>
          </span>
        ) : (
          <span>
            added comment:
            <br />
            <i>{`&quot;${content}&quot;`}</i>
          </span>
        )}
        <br />
        to card&nbsp;
        {this.cardLink(cardId, cardTitle)}
      </span>
    );
  }

  COLUMNADDEDActivityHtml(activity) {
    const { meta: { columnName } } = activity;
    return (
      <span>
        <span>added column </span>
        <i>{columnName}</i>
      </span>
    );
  }

  COLUMNREMOVEDActivityHtml(activity) {
    const { meta: { columnName } } = activity;
    return (
      <span>
        <span>removed column </span>
        <i>{columnName}</i>
      </span>
    );
  }

  cardLink(cardId, cardTitle) {
    return this.cardsRepo.cardExists(cardId) ? (
      <FunctionLink
        className="link"
        onClick={() => this.openCard(cardId)}
      >
        {cardTitle}
      </FunctionLink>
    ) : (
      <span className="link item-removed-link">
        {`${cardTitle} (removed)`}
      </span>
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
        <small className="author">{author}</small>
        <span className="content">{content}</span>
      </div>
    );
  }
}
