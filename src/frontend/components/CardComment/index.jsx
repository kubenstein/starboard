import React from 'react';
import Avatar from 'components/Avatar';
import CommentsRepository from 'lib/repositories/comments-repository';
import UsersRepository from 'lib/repositories/users-repository';
import { formattedDate } from 'lib/utils';
import 'components/CardComment/styles.scss';

export default class CardComment extends React.Component {
  constructor(props) {
    super(props);
    this.comment = this.props.comment;
    this.stateManager = this.props.stateManager;
    this.commentsRepo = new CommentsRepository(this.stateManager);
    this.usersRepo = new UsersRepository(this.stateManager);
  }

  removeComment(commentId) {
    if (confirm('Do you want to remove this comment?')) {
      this.commentsRepo.removeComment(commentId);
    }
  }

  isImage(attachment) {
    return attachment.type.indexOf('image') !== -1;
  }

  authorNameHtml(authorId) {
    const nickname = this.usersRepo.userNickname(authorId) || authorId;
    return <span className="author" title={authorId}>{nickname}</span>;
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
    const { stateManager } = this.props;
    return (
      <div className="card-comment" key={comment.id}>
        <Avatar
          className="avatar"
          userId={comment.authorId}
          stateManager={stateManager}
        />
        {this.authorNameHtml(comment.authorId)}
        <span className="date">{formattedDate(comment.createdAt)}</span>
        <p className="content">
          { comment.attachment && this.attachmentCommentHTML(comment) }
          {comment.content}
        </p>
        <span
          className="btn-link btn-small btn-remove-comment"
          onClick={() => { this.removeComment(comment.id); }}
        >Delete</span>
      </div>
    );
  }
}
