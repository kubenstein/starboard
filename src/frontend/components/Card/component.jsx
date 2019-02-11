import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CardDetails from 'components/CardDetails';
import Avatar from 'components/Avatar';
import FunctionLink from 'components/FunctionLink';
import 'components/Card/styles.scss';

export default class Card extends React.Component {
  static propTypes = {
    card: PropTypes.shape().isRequired,
    commentCount: PropTypes.number.isRequired,
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    textForLabel: PropTypes.func.isRequired,
  }

  clickedOverlay = (e) => {
    const { onClose } = this.props;
    if (e.target.className === this.dismissOverlayElement.props.className) {
      onClose();
    }
  }

  render() {
    const {
      commentCount,
      isOpen,
      onOpen,
      onClose,
      textForLabel,
      card,
      card: { title, id, labels = [], memberIds = [] },
    } = this.props;
    return (
      <Fragment>
        <FunctionLink
          component="div"
          className={`card-wrapper ${isOpen ? 'card-opened' : ''}`}
          data-dnd-data-card-id={id}
          onClick={() => !isOpen && onOpen()}
        >
          <div className="card card-DND-handler">
            <ul className="labels">
              { labels.map(label => (
                <li
                  key={label}
                  className="label card-DND-handler"
                  title={textForLabel(label)}
                  style={{ backgroundColor: label }}
                />
              ))}
            </ul>
            <span className="title card-DND-handler">{title}</span>
            { commentCount > 0 && (
              <span className="comment-counter card-DND-handler">
                {`☰ ${commentCount}`}
              </span>
            )}
            <div className="members">
              { memberIds.map(memberId => (
                <Avatar
                  key={memberId}
                  className="member card-DND-handler"
                  userId={memberId}
                />
              ))}
            </div>
          </div>
        </FunctionLink>
        {isOpen && (
          <FunctionLink
            className="card-details-full-screen-wrapper"
            onClick={this.clickedOverlay}
            ref={(e) => { this.dismissOverlayElement = e; }}
          >
            <CardDetails
              card={card}
              onClose={onClose}
            />
          </FunctionLink>
        )}
      </Fragment>
    );
  }
}
