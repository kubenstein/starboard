import React from 'react';
import CommentsRepository from 'lib/comments-repository.js';
import ColumnsRepository from 'lib/columns-repository.js';
import CardsRepository from 'lib/cards-repository.js';
import SettingsRepository from 'lib/settings-repository.js';
import EdditableInput from 'components/EdditableInput/EdditableInput.jsx';
import AddCommentForm from 'components/AddCommentForm/AddCommentForm.jsx';
import CardComment from 'components/CardComment/CardComment.jsx';
import 'components/CardDetails/card-details.scss';

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.columnsRepo = new ColumnsRepository(this.stateManager);
    this.commentsRepo = new CommentsRepository(this.stateManager);
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.settingsRepo = new SettingsRepository(this.stateManager);
    this.card = this.props.data;
  }

  textForLabel(color) {
    return this.settingsRepo.getTextForLabel(color);
  }

  updateTitle(newValue) {
    const oldValue = this.card.value;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(this.card.id, { title: newValue });
    }
  }

  updateDescription(newValue) {
    const oldValue = this.card.description;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(this.card.id, { description: newValue });
    }
  }

  removeCard(cardId) {
    if (confirm('Do you want to remove this card?')) {
      this.cardsRepo.removeCard(cardId);
    }
  }

  render() {
    const { title, description, id, columnId, labels } = this.card;
    const comments = this.commentsRepo.getCommentsForCard(id);
    const columnName = this.columnsRepo.getColumn(columnId).name;
    return (
      <div className="card-details">
        <div className="title-wrapper">
          <EdditableInput
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
        <EdditableInput
          className="description-input"
          type="textarea"
          value={description}
          ref={(e) => { this.descriptionInput = e; }}
          onChange={(value) => { this.updateDescription(value); }}
        />
        <div className="utils-section">
          <a className="btn btn-danger btn-small" onClick={() => { this.removeCard(id); }}>Delete Card</a>
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
