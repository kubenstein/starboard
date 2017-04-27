import React from 'react';
import 'components/CardDetails/card-details.scss';

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  getComments() {
    const bucket = this.store.bucket('comments');
    const card = this.props.data;
    return bucket.filter((c) => {
      return c.cardId === card.id;
    });
  }

  render() {
    const { title, description } = this.props.data;
    const comments = this.getComments();
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
