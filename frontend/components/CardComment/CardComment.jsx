import React from 'react';
import CommentsRepository from 'lib/comments-repository.js';
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
    return attachment.fileType.indexOf('image') !== -1;
  }

  formattedDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toString();
  }

  attachmentCommentHTML(comment) {
    return this.isImage(comment.attachment) ?
      <a href={comment.attachment.dataUrl} className="attachment" target="_blank" rel="noopener noreferrer">
        <img src={comment.attachment.dataUrl} alt={comment.attachment.fileName} />
        <span className="attachment-description">{comment.attachment.fileName}</span>
      </a>
    :
      <a href={comment.attachment.dataUrl} className="attachment" target="_blank" rel="noopener noreferrer">
        <span className="attachment-file-wrapper" />
        <span className="attachment-description">{comment.attachment.fileName}</span>
      </a>;
  }

  render() {
    const comment = this.comment;
    return (
      <div className="card-comment" key={comment.id}>
        <span className="author">{comment.author.name}</span>
        <span className="date">{this.formattedDate(comment.createdAt)}</span>
        <p className="content">
          { comment.attachment && this.attachmentCommentHTML(comment) }
          {comment.content}
        </p>
        <span className="btn-delete" onClick={() => { this.removeComment(comment.id); }}>Delete</span>
      </div>
    );
  }
}
