import React from 'react';
import CardDetails from 'components/CardDetails/CardDetails.jsx';
import BrowserSettings from 'lib/browser-settings.js';
import SettingsRepository from 'lib/settings-repository.js';
import CommentsRepository from 'lib/comments-repository.js';
import 'components/Card/card.scss';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.card = this.props.data;
    this.stateManager = this.props.stateManager;
    this.settingsRepo = new SettingsRepository(this.stateManager);
    this.commentsRepo = new CommentsRepository(this.stateManager);
    this.browserSettings = new BrowserSettings();
    this.state = {
      detailsOpened: false,
    };
  }

  componentDidMount() {
    if (this.card.id === this.browserSettings.urlCardId()) {
      this.openDetails();
    }
  }

  textForLabel(color) {
    return this.settingsRepo.textForLabel(color);
  }

  openDetails() {
    this.setState({ detailsOpened: true });
  }

  clickedOverlay(e) {
    if (e.target === this.dismissOverlayElement) {
      this.closeDetails();
    }
  }

  closeDetails() {
    setTimeout(() => {
      this.setState({ detailsOpened: false });
    }, 0);
  }

  additionalCssClass() {
    return this.state.detailsOpened ? 'card-opened' : '';
  }

  render() {
    const { labels, title, id } = this.card;
    const { detailsOpened } = this.state;
    const commentCounter = this.commentsRepo.commentsCountForCard(id);
    return (
      <div
        className={`card-wrapper ${this.additionalCssClass()}`}
        data-DND-data-card-id={id}
        onClick={() => { this.openDetails(); }}
      >
        <div className="card card-DND-handler">
          <ul className="labels">
            { (labels || []).map(label =>
              <li
                key={label}
                className="label card-DND-handler"
                title={this.textForLabel(label)}
                style={{ backgroundColor: label }}
              />
            )}
          </ul>
          <span className="title card-DND-handler">{title}</span>
          { commentCounter > 0 &&
            <span className="comment-counter card-DND-handler">☰ {commentCounter}</span>
          }
        </div>
        {detailsOpened &&
          <div
            className="card-details-full-screen-wrapper"
            onClick={(e) => { this.clickedOverlay(e); }}
            ref={(r) => { this.dismissOverlayElement = r; }}
          >
            <CardDetails
              data={this.card}
              onCloseBtnPressed={() => { this.closeDetails(); }}
              stateManager={this.stateManager}
            />
          </div>
        }
      </div>
    );
  }
}
