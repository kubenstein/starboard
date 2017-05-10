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
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const attachmentInfo = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        dataUrl: reader.result,
      };

      this.repo.addComment(this.cardId, { attachment: attachmentInfo }).then(() => {
        this.setState({ uploadingAttachment: false });
      });
    }, false);
    reader.readAsDataURL(file);
  }

  submit(e) {
    e.preventDefault();
    const { content } = serialize(this.form, { hash: true });
    if (content) {
      this.repo.addComment(this.cardId, { content: content }).then(() => {
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
        <input className="btn btn-add" type="submit" value="Add Comment" />
        { uploadingAttachment ?
          <span className="btn btn-add btn-input-file btn-process">
            Processing...
          </span>
        :
          <label htmlFor="file" className="btn btn-add btn-input-file">
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
