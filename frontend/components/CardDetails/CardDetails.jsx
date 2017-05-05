import React from 'react';
import CommentsRepository from 'lib/comments-repository.js';
import CardsRepository from 'lib/cards-repository.js';
import EdditableInput from 'components/EdditableInput/EdditableInput.jsx';
import 'components/CardDetails/card-details.scss';

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.commentsRepo = new CommentsRepository(this.stateManager);
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.cardData = this.props.data;
  }

  updateTitle(newValue) {
    const oldValue = this.cardData.value;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(this.cardData.id, { title: newValue });
    }
  }

  updateDescription(newValue) {
    const oldValue = this.cardData.description;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(this.cardData.id, { description: newValue });
    }
  }

  render() {
    const { title, description, id } = this.cardData;
    const comments = this.commentsRepo.getCommentsForCard(id);
    return (
      <div className="card-details">
        <EdditableInput
          className="title"
          value={title}
          onChange={(value) => { this.updateTitle(value); }}
        />
        <h4 className="sub-title">Description:</h4>
        <EdditableInput
          className="description-input"
          type="textarea"
          value={description}
          ref={(e) => { this.descriptionInput = e; }}
          onChange={(value) => { this.updateDescription(value); }}
        />
        <h4 className="sub-title">Comments:</h4>
        { comments.map(comment =>
          <div className="card-comment" key={comment.id}>
            <span className="author">{comment.author.name}</span>
            <p className="content">{comment.content}</p>
          </div>
        )}
      </div>
    );
  }
}
