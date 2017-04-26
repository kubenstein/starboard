import React from 'react';
import 'components/CardDetails/card-details.scss';

export default class CardDetails extends React.Component {

  comments() {
    return [
      { id: 1, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 1' },
      { id: 2, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 2' }
    ];
  }

  render() {
    const cardData = this.props.data;
    const comments = this.comments();
    return (
      <div className="card-details">
        <h1 className="title">{cardData.title}</h1>
        <h4 className="sub-title">Description:</h4>
        <p className="desciption">{cardData.description}</p>
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
