import React from 'react';
import EditableInput from 'components/EditableInput';
import AddCommentForm from 'components/AddCommentForm';
import CardComment from 'components/CardComment';
import CardLabelPicker from 'components/CardLabelPicker';
import CommentsRepository from 'lib/repositories/comments-repository';
import ColumnsRepository from 'lib/repositories/columns-repository';
import CardsRepository from 'lib/repositories/cards-repository';
import SettingsRepository from 'lib/repositories/settings-repository';
import BrowserSettingsService from 'lib/services/browser-settings-service';
import 'components/CardDetails/styles.scss';

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.onClose = this.props.onClose;
    this.columnsRepo = new ColumnsRepository(this.stateManager);
    this.commentsRepo = new CommentsRepository(this.stateManager);
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.settingsRepo = new SettingsRepository(this.stateManager);
    this.browserSettingsService = new BrowserSettingsService();
    this.card = this.props.data;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount() {
    this.browserSettingsService.setUrlForCard(this.card);
     window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    this.browserSettingsService.setMainUrl();
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') this.onClose();
  }

  textForLabel(color) {
    return this.settingsRepo.textForLabel(color);
  }

  updateTitle(newValue) {
    const { value: oldValue, id } = this.card;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(id, { title: newValue });
    }
  }

  updateDescription(newValue) {
    const { description: oldValue, id } = this.card;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(id, { description: newValue });
    }
  }

  updateLabels(toggledLabel) {
    const labels = this.card.labels || [];
    const shouldBeSet = (labels.indexOf(toggledLabel) === -1);
    this.cardsRepo.updateLabel(this.card.id, toggledLabel, shouldBeSet);
  }

  removeCard(cardId) {
    if (confirm('Do you want to remove this card?')) {
      this.cardsRepo.removeCard(cardId);
    }
  }

  render() {
    const { title, description, id, columnId, labels } = this.card;
    const comments = this.commentsRepo.commentsForCard(id);
    const columnName = this.columnsRepo.get(columnId).name;
    return (
      <div className="card-details">
        <div className="title-wrapper">
          <button
            className="btn btn-raw-icon btn-close"
            onClick={() => { this.onClose(); }}
          >✕</button>
          <EditableInput
            className="title"
            value={title}
            onChange={(value) => { this.updateTitle(value); }}
          />
        </div>
        <h4 className="sub-title">{`In Column: ${columnName}`}</h4>
        <ul className="labels">
          { (labels || []).map(label =>
            <li
              key={label}
              className="label"
              style={{ backgroundColor: label }}
            >
              {this.textForLabel(label)}
            </li>
          )}
        </ul>
        <h4 className="sub-title">Description:</h4>
        <EditableInput
          className="description-input"
          type="textarea"
          value={description}
          ref={(e) => { this.descriptionInput = e; }}
          onChange={(value) => { this.updateDescription(value); }}
        />
        <div className="utils-section">
          <a
            className="btn btn-danger btn-small btn-remove-card"
            onClick={() => { this.removeCard(id); }}
          >Delete Card</a>
          <label
            className="btn btn-success btn-small btn-manage-labels"
            htmlFor="label-picker-checkbox"
          >Manage Labels</label>
          <input type="checkbox" id="label-picker-checkbox" className="label-picker-checkbox" />
          <label htmlFor="label-picker-checkbox" className="label-picker-visible off-trigger" />
          <div className="label-picker-visible label-picker-wrapper">
            <CardLabelPicker
              className="label-picker"
              data={this.card}
              stateManager={this.stateManager}
              onLabelPicked={(label) => { this.updateLabels(label); }}
            />
          </div>

        </div>
        <h4 className="section-title clearfix">Comments:</h4>
        <AddCommentForm cardId={id} stateManager={this.stateManager} />
        { comments.map(comment =>
          <CardComment key={comment.id} comment={comment} stateManager={this.stateManager} />
        )}
      </div>
    );
  }
}
