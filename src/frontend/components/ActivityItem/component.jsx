import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FunctionLink from 'components/FunctionLink';
import { formattedDate } from 'lib/utils';
import 'components/ActivityItem/styles.scss';

export default class ActivityItem extends React.Component {
  static propTypes = {
    activity: PropTypes.shape().isRequired,
    textForLabel: PropTypes.func.isRequired,
    userNickname: PropTypes.func.isRequired,
    isCardExists: PropTypes.func.isRequired,
    onCardOpen: PropTypes.func.isRequired,
  }

  renderAuthor(activity) {
    const { userNickname } = this.props;
    const { requesterId } = activity;
    return userNickname(requesterId) || requesterId;
  }

  renderContent(activity) {
    const type = activity.type.replace(/_/g, '');
    const handler = this[`render${type}`];
    return handler ? handler.bind(this)(activity) : '';
  }

  // handlers

  renderCARDADDED = (activity) => {
    const { data: { id }, meta: { cardTitle } } = activity;
    return (
      <Fragment>
        added card&nbsp;
        {this.renderCardLink(id, cardTitle)}
      </Fragment>
    );
  }

  renderCARDREMOVED = (activity) => {
    const { data: { id }, meta: { cardTitle } } = activity;
    return (
      <Fragment>
        removed card&nbsp;
        {this.renderCardLink(id, cardTitle)}
      </Fragment>
    );
  }

  renderCARDLABELUPDATED = (activity) => {
    const { textForLabel } = this.props;
    const { data: { label, set, cardId }, meta: { cardTitle } } = activity;
    const labelName = textForLabel(label);
    return (
      <Fragment>
        {set ? 'set label:' : 'removed label:'}
        <i>{labelName}</i>
        {set ? ' to card' : ' from card'}
        &nbsp;
        {this.renderCardLink(cardId, cardTitle)}
      </Fragment>
    );
  }

  renderCARDMEMBERUPDATED = (activity) => {
    const { userNickname } = this.props;
    const { data: { userId: memberId, set, cardId }, meta: { cardTitle } } = activity;
    const memberName = userNickname(memberId) || memberId;
    return (
      <Fragment>
        {set ? 'assigned ' : 'unassigned '}
        <i>{memberName}</i>
        {set ? ' to ' : ' from '}
        card&nbsp;
        {this.renderCardLink(cardId, cardTitle)}
      </Fragment>
    );
  }

  renderCOMMENTADDED = (activity) => {
    const { data: { content, attachment, cardId }, meta: { cardTitle } } = activity;

    return (
      <Fragment>
        { attachment ? (
          <Fragment>
            added attachment:
            <br />
            <i>{`&quot;${attachment.name}&quot;`}</i>
          </Fragment>
        ) : (
          <Fragment>
            added comment:
            <br />
            <i>{`&quot;${content}&quot;`}</i>
          </Fragment>
        )}
        <br />
        to card&nbsp;
        {this.renderCardLink(cardId, cardTitle)}
      </Fragment>
    );
  }

  renderCOLUMNADDED = (activity) => {
    const { meta: { columnName } } = activity;
    return (
      <Fragment>
        added column&nbsp;
        <i>{columnName}</i>
      </Fragment>
    );
  }

  renderCOLUMNREMOVED = (activity) => {
    const { meta: { columnName } } = activity;
    return (
      <Fragment>
        removed column&nbsp;
        <i>{columnName}</i>
      </Fragment>
    );
  }

  renderCardLink(cardId, cardTitle) {
    const { onCardOpen, isCardExists } = this.props;

    return isCardExists(cardId) ? (
      <FunctionLink
        className="link"
        onClick={() => onCardOpen(cardId)}
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
    return (
      <div className="activity-item">
        <small className="date">{formattedDate(activity.createdAt)}</small>
        <small className="author">{this.renderAuthor(activity)}</small>
        <span className="content">{this.renderContent(activity)}</span>
      </div>
    );
  }
}
