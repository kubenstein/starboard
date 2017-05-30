import React from 'react';
import CardDetails from 'components/CardDetails/CardDetails.jsx';
import CommentsRepository from 'lib/comments-repository.js';
import 'components/Card/card.scss';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.card = this.props.data;
    this.stateManager = this.props.stateManager;
    this.commentsRepo = new CommentsRepository(this.stateManager);
    this.state = {
      detailsOpened: false,
    };
  }

  openDetails() {
    this.setState({ detailsOpened: true });
  }

  closeDetails(e) {
    if (e.target === this.dismissOverlayElement) {
      setTimeout(() => {
        this.setState({ detailsOpened: false });
      }, 0);
    }
  }

  render() {
    const { labels, title, id } = this.card;
    const { detailsOpened } = this.state;
    const commentCounter = this.commentsRepo.commentsCountForCard(id);
    return (
      <div
        className="card"
        data-DND-data-card-id={id}
        onClick={() => { this.openDetails(); }}
      >
        <div className="title card-DND-handler">
          <ul className="labels">
            { (labels || []).map(label =>
              <li
                key={label}
                className="label"
                style={{ backgroundColor: label }}
              />
            )}
          </ul>
          {title}
          { commentCounter > 0 &&
            <span className="comment-counter card-DND-handler">☰ {commentCounter}</span>
          }
        </div>
        {detailsOpened ?
          <div
            className="card-details-full-screen-wrapper"
            onClick={(e) => { this.closeDetails(e); }}
            ref={(r) => { this.dismissOverlayElement = r; }}
          >
            <CardDetails data={this.card} stateManager={this.stateManager} />
          </div>
        : ''}
      </div>
    );
  }
}
