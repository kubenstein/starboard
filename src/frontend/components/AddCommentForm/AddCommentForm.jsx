import React from 'react';
import serialize from 'form-serialize';
import CommentsRepository from 'lib/comments-repository.js';
import 'components/AddCommentForm/add-comment-form.scss';

export default class AddCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.cardId = this.props.cardId;
    this.stateManager = this.props.stateManager;
    this.repo = new CommentsRepository(this.stateManager);
    this.state = {
      uploadingAttachment: false
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
    this.setState({ uploadingAttachment: true });
    const file = this.fileInput.files[0];
    const attachmentInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      blob: file,
    };
    const userId = this.stateManager.getUserId();
    this.repo.addComment(this.cardId, { attachment: attachmentInfo, authorId: userId }).then(() => {
      this.setState({ uploadingAttachment: false });
    });
  }

  submit(e) {
    e.preventDefault();
    const { content } = serialize(this.form, { hash: true });
    if (content) {
      const userId = this.stateManager.getUserId();
      this.repo.addComment(this.cardId, { content: content, authorId: userId }).then(() => {
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
        <input className="btn btn-success" type="submit" value="Add Comment" />
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
