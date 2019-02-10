import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import 'components/AddCommentForm/styles.scss';

export default class AddCommentForm extends React.Component {
  static propTypes = {
    addComment: PropTypes.func.isRequired,
  }

  state = {
    uploadingAttachment: false,
  };

  submitFormOnEnter = e => (e.key === 'Enter') && this.submit(e);

  handleFileUpload = () => {
    const { addComment } = this.props;
    this.setState({ uploadingAttachment: true });
    const file = this.fileInput.files[0];
    const attachment = {
      name: file.name,
      size: file.size,
      type: file.type,
      blob: file,
    };
    addComment({ attachment })
      .then(() => this.setState({ uploadingAttachment: false }));
  }

  submit = (e) => {
    e.preventDefault();
    const { addComment } = this.props;
    const { content } = serialize(this.form, { hash: true });
    if (content) {
      addComment({ content })
        .then(() => this.clear());
    }
  }

  clear() {
    this.input.value = '';
  }

  render() {
    const { uploadingAttachment } = this.state;
    return (
      <form
        className="add-comment-form"
        ref={(e) => { this.form = e; }}
        onSubmit={this.submit}
      >
        <textarea
          className="content"
          name="content"
          placeholder="Write a comment..."
          ref={(e) => { this.input = e; }}
          onKeyPress={this.submitFormOnEnter}
        />
        <input className="btn btn-success btn-submit-text" type="submit" value="Add Comment" />
        { uploadingAttachment ? (
          <span className="btn btn-success btn-input-file btn-process">
            Processing...
          </span>
        ) : (
          <label htmlFor="file" className="btn btn-success btn-input-file">
            Add Attachment
            <input
              className="file-input"
              type="file"
              id="file"
              ref={(e) => { this.fileInput = e; }}
              onChange={this.handleFileUpload}
            />
          </label>
        )}
      </form>
    );
  }
}
