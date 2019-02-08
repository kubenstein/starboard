import React from 'react';
import PropTypes from 'prop-types';
import CardDetails from 'components/CardDetails';
import Avatar from 'components/Avatar';
import 'components/Card/styles.scss';

export default class Card extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
    card: PropTypes.object.isRequired, // TODO change to shape
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.settingsRepo = this.deps.get('settingsRepository');
    this.commentsRepo = this.deps.get('commentsRepository');
    this.uiRepo = this.deps.get('uiRepository');
  }

  openDetails = () => {
    const { card: { id } } = this.props;
    this.uiRepo.set('card:openedId', id);
  }

  closeDetails = () => this.uiRepo.set('card:openedId', null);

  textForLabel = color => this.settingsRepo.textForLabel(color);

  clickedOverlay = (e) => {
    if (e.target === this.dismissOverlayElement) {
      this.closeDetails();
    }
  }

  render() {
    const { card, card: { title, id, labels = [], memberIds = [] } } = this.props;
    const detailsOpened = (this.uiRepo.get('card:openedId') === id);
    const commentCounter = this.commentsRepo.commentsCountForCard(id);
    return (
      <div
        className={`card-wrapper ${detailsOpened ? 'card-opened' : ''}`}
        data-DND-data-card-id={id}
        onClick={() => !detailsOpened && this.openDetails()}
      >
        <div className="card card-DND-handler">
          <ul className="labels">
            { labels.map(label => (
              <li
                key={label}
                className="label card-DND-handler"
                title={this.textForLabel(label)}
                style={{ backgroundColor: label }}
              />
            ))}
          </ul>
          <span className="title card-DND-handler">{title}</span>
          { commentCounter > 0 && (
            <span className="comment-counter card-DND-handler">
              {`☰ ${commentCounter}`}
            </span>
          )}
          <div className="members">
            { memberIds.map(memberId => (
              <Avatar
                key={memberId}
                className="member card-DND-handler"
                deps={this.deps}
                userId={memberId}
              />
            ))}
          </div>
        </div>
        {detailsOpened &&
          <div
            className="card-details-full-screen-wrapper"
            onClick={this.clickedOverlay}
            ref={(e) => { this.dismissOverlayElement = e; }}
          >
            <CardDetails
              card={card}
              onClose={this.closeDetails}
              deps={this.deps}
            />
          </div>
        }
      </div>
    );
  }
}
