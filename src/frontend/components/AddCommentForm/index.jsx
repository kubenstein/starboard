import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import CommentsRepository from 'lib/repositories/comments-repository';
import 'components/AddCommentForm/styles.scss';

export default class AddCommentForm extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired,
      cardId: PropTypes.string.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { stateManager } = this.props;
    this.repo = new CommentsRepository(stateManager);
    this.state = {
      uploadingAttachment: false,
    };
  }

  submitFormOnEnter(e) {
    if (e.key === 'Enter') {
      this.submit(e);
    }
  }

  clear() {
    this.input.value = '';
  }

  handleFileUpload() {
    const { cardId, stateManager } = this.props;
    this.setState({ uploadingAttachment: true });
    const file = this.fileInput.files[0];
    const attachmentInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      blob: file,
    };
    const userId = stateManager.getUserId();
    this.repo.addComment(cardId, { attachment: attachmentInfo, authorId: userId }).then(() => {
      this.setState({ uploadingAttachment: false });
    });
  }

  submit(e) {
    e.preventDefault();
    const { cardId, stateManager } = this.props;
    const { content } = serialize(this.form, { hash: true });
    if (content) {
      const userId = stateManager.getUserId();
      this.repo.addComment(cardId, { content: content, authorId: userId }).then(() => {
        this.clear();
      });
    }
  }

  render() {
    const { uploadingAttachment } = this.state;
    return (
      <form
        className="add-comment-form"
        ref={(e) => { this.form = e; }}
        onSubmit={(e) => { this.submit(e); }}
      >
        <textarea
          className="content"
          name="content"
          placeholder="Write a comment..."
          ref={(e) => { this.input = e; }}
        />
        <input className="btn btn-success btn-submit-text" type="submit" value="Add Comment" />
        { uploadingAttachment ?
          <span className="btn btn-success btn-input-file btn-process">
            Processing...
          </span>
        :
          <label htmlFor="file" className="btn btn-success btn-input-file">
            Add Attachment
            <input
              className="file-input"
              type="file"
              id="file"
              ref={(e) => { this.fileInput = e; }}
              onChange={() => { this.handleFileUpload(); }}
            />
          </label>
        }
      </form>
    );
  }
}
