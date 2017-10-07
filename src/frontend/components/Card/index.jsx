import React from 'react';
import PropTypes from 'prop-types';
import CardDetails from 'components/CardDetails';
import 'components/Card/styles.scss';

export default class Card extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
      card: PropTypes.object.isRequired, // TODO change to shape
    };
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.settingsRepo = this.deps.get('settingsRepository');
    this.commentsRepo = this.deps.get('commentsRepository');
    this.browserSettingsService = this.deps.get('browserSettingsService');
    this.state = {
      detailsOpened: false,
    };
  }

  componentDidMount() {
    const { card } = this.props;
    const cardToOpen = this.browserSettingsService.urlCardId();
    if (card.id === cardToOpen) {
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
    const { card } = this.props;
    const { detailsOpened } = this.state;
    const { labels, title, id } = card;
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
              />,
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
              card={card}
              onClose={() => { this.closeDetails(); }}
              deps={this.deps}
            />
          </div>
        }
      </div>
    );
  }
}
