import React from 'react';
import CommentsRepository from 'lib/comments-repository.js';
import 'components/CardDetails/card-details.scss';

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.repo = new CommentsRepository(this.stateManager);
  }

  render() {
    const { title, description, id } = this.props.data;
    const comments = this.repo.getCommentsForCard(id);
    return (
      <div className="card-details">
        <h1 className="title">{title}</h1>
        <h4 className="sub-title">Description:</h4>
        <p className="desciption">{description}</p>
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
