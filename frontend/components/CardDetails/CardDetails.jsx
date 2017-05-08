import React from 'react';
import CommentsRepository from 'lib/comments-repository.js';
import ColumnsRepository from 'lib/columns-repository.js';
import CardsRepository from 'lib/cards-repository.js';
import EdditableInput from 'components/EdditableInput/EdditableInput.jsx';
import AddCommentForm from 'components/AddCommentForm/AddCommentForm.jsx';
import 'components/CardDetails/card-details.scss';

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.columnsRepo = new ColumnsRepository(this.stateManager);
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

  removeComment(commentId) {
    if (confirm('Do you want to remove this comment?')) {
      this.commentsRepo.removeComment(commentId);
    }
  }

  formattedDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toString();
  }

  render() {
    const { title, description, id, columnId } = this.cardData;
    const comments = this.commentsRepo.getCommentsForCard(id);
    const columnName = this.columnsRepo.getColumn(columnId).name;
    return (
      <div className="card-details">
        <EdditableInput
          className="title"
          value={title}
          onChange={(value) => { this.updateTitle(value); }}
        />
        <h4 className="sub-title no-top-margin">{`In Column: ${columnName}`}</h4>
        <h4 className="sub-title">Description:</h4>
        <EdditableInput
          className="description-input"
          type="textarea"
          value={description}
          ref={(e) => { this.descriptionInput = e; }}
          onChange={(value) => { this.updateDescription(value); }}
        />
        <h4 className="title">Add Comment</h4>
        <AddCommentForm cardId={id} stateManager={this.stateManager} />
        { comments.map(comment =>
          <div className="card-comment" key={comment.id}>
            <span className="author">{comment.author.name}</span>
            <span className="date">{this.formattedDate(comment.createdAt)}</span>
            <p className="content">{comment.content}</p>
            <span className="btn-delete" onClick={() => { this.removeComment(comment.id); }}>Delete</span>
          </div>
        )}
      </div>
    );
  }
}
