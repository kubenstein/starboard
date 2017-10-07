import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';
import { formattedDate } from 'lib/utils';
import 'components/CardComment/styles.scss';

export default class CardComment extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
      comment: PropTypes.object.isRequired, // TODO change to shape
    };
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.commentsRepo = this.deps.get('commentsRepository');
    this.usersRepo = this.deps.get('usersRepository');
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
    const { comment } = this.props;
    return (
      <div className="card-comment" key={comment.id}>
        <Avatar
          className="avatar"
          userId={comment.authorId}
          stateManager={this.deps.get('stateManager')}
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
