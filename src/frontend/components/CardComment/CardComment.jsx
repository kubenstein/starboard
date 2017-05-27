import React from 'react';
import CommentsRepository from 'lib/comments-repository.js';
import { formattedDate } from 'lib/utils.js';
import 'components/CardComment/card-comment.scss';

export default class CardComment extends React.Component {
  constructor(props) {
    super(props);
    this.comment = this.props.comment;
    this.stateManager = this.props.stateManager;
    this.commentsRepo = new CommentsRepository(this.stateManager);
  }

  removeComment(commentId) {
    if (confirm('Do you want to remove this comment?')) {
      this.commentsRepo.removeComment(commentId);
    }
  }

  isImage(attachment) {
    return attachment.type.indexOf('image') !== -1;
  }

  attachmentCommentHTML(comment) {
    return (
      <a href={comment.attachment.dataUrl} className="attachment" target="_blank" rel="noopener noreferrer">
        { this.isImage(comment.attachment) ?
          <img src={comment.attachment.dataUrl} alt={comment.attachment.name} />
        :
          <span className="attachment-file-wrapper" />
        }
        <span className="attachment-description">{comment.attachment.name}</span>
      </a>
    );
  }

  render() {
    const comment = this.comment;
    return (
      <div className="card-comment" key={comment.id}>
        <span className="author">{comment.author.name}</span>
        <span className="date">{formattedDate(comment.createdAt)}</span>
        <p className="content">
          { comment.attachment && this.attachmentCommentHTML(comment) }
          {comment.content}
        </p>
        <span className="btn-link btn-small" onClick={() => { this.removeComment(comment.id); }}>Delete</span>
      </div>
    );
  }
}
