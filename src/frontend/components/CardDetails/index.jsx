import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import AddCommentForm from 'components/AddCommentForm';
import CardComment from 'components/CardComment';
import CardLabelPicker from 'components/CardLabelPicker';
import 'components/CardDetails/styles.scss';

export default class CardDetails extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
      onClose: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.columnsRepo = this.deps.get('columnsRepository');
    this.commentsRepo = this.deps.get('commentsRepository');
    this.cardsRepo = this.deps.get('cardsRepository');
    this.uiRepo = this.deps.get('uiRepository');
    this.settingsRepo = this.deps.get('settingsRepository');
    this.browserSettingsService = this.deps.get('browserSettingsService');
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount() {
    this.browserSettingsService.registerKeyDownEvent(this.handleKeyDown);
  }

  componentWillUnmount() {
    this.browserSettingsService.unregisterKeyDownEvent(this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') this.props.onClose();
  }

  textForLabel(color) {
    return this.settingsRepo.textForLabel(color);
  }

  updateTitle(newValue) {
    const { card } = this.props;
    const { value: oldValue, id } = card;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(id, { title: newValue });
    }
  }

  updateDescription(newValue) {
    const { card } = this.props;
    const { description: oldValue, id } = card;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(id, { description: newValue });
    }
  }

  updateLabels(toggledLabel) {
    const { card } = this.props;
    const labels = card.labels || [];
    const shouldBeSet = (labels.indexOf(toggledLabel) === -1);
    this.cardsRepo.updateLabel(card.id, toggledLabel, shouldBeSet);
  }

  removeCard(cardId) {
    if (confirm('Do you want to remove this card?')) {
      this.cardsRepo.removeCard(cardId);
    }
  }

  render() {
    const { card, onClose } = this.props;
    const { title, description, id, columnId, labels } = card;
    const comments = this.commentsRepo.commentsForCard(id);
    const columnName = this.columnsRepo.get(columnId).name;
    const labelPickerOpened = this.uiRepo.get('card:openLabelsPicker');
    return (
      <div className="card-details">
        <div className="title-wrapper">
          <button
            className="btn btn-raw-icon btn-close"
            onClick={() => { onClose(); }}
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
            </li>,
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
          <a
            className="btn btn-success btn-small btn-manage-labels"
            onClick={() => this.uiRepo.toggle('card:openLabelsPicker')}
          >Manage Labels</a>
          { labelPickerOpened && (
            <div>
              <div
                className="off-trigger"
                onClick={() => this.uiRepo.toggle('card:openLabelsPicker')}
              />
              <div className="label-picker-wrapper">
                <CardLabelPicker
                  className="label-picker"
                  card={card}
                  deps={this.deps}
                  onLabelPicked={(label) => { this.updateLabels(label); }}
                />
              </div>
            </div>
          )}

        </div>
        <h4 className="section-title clearfix">Comments:</h4>
        <AddCommentForm cardId={id} deps={this.deps} />
        { comments.map(comment =>
          <CardComment
            key={comment.id}
            comment={comment}
            deps={this.deps}
          />,
        )}
      </div>
    );
  }
}
