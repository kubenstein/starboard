import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';
import FunctionLink from 'components/FunctionLink';
import { formattedDate } from 'lib/utils';
import 'components/CardComment/styles.scss';

const isImage = attachment => attachment.type.indexOf('image') !== -1;

export default class CardComment extends React.Component {
  static propTypes = {
    nickname: PropTypes.string,
    removeComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired, // TODO change to shape
  }

  removeComment = () => {
    const { removeComment } = this.props;
    if (window.confirm('Do you want to remove this comment?')) {
      removeComment();
    }
  }

  renderAttachmentComment() {
    const { comment: { attachment } } = this.props;
    return (
      <a href={attachment.dataUrl} className="attachment" target="_blank" rel="noopener noreferrer">
        { isImage(attachment) ? (
          <img src={attachment.dataUrl} alt={attachment.name} />
        ) : (
          <span className="attachment-file-wrapper" />
        )}
        <span className="attachment-description">{attachment.name}</span>
      </a>
    );
  }

  render() {
    const { nickname, comment: { authorId, createdAt, id, content, attachment } } = this.props;
    const userName = nickname || authorId;
    return (
      <div className="card-comment" key={id}>
        <Avatar
          className="avatar"
          userId={authorId}
        />
        <span className="author" title={authorId}>{userName}</span>
        <span className="date">{formattedDate(createdAt)}</span>
        <p className="content">
          {attachment && this.renderAttachmentComment() }
          {content}
        </p>
        <FunctionLink
          component="span"
          className="btn-link btn-small btn-remove-comment"
          onClick={this.removeComment}
        >
          Delete
        </FunctionLink>
      </div>
    );
  }
}
