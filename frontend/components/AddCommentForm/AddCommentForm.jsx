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
  }

  submitFormOnEnter(e) {
    if (e.key === 'Enter') {
      this.submit(e);
    }
  }

  clear() {
    this.input.value = '';
  }

  submit(e) {
    e.preventDefault();
    const { content } = serialize(this.form, { hash: true });
    if (content) {
      this.repo.addComment(this.cardId, content).then(() => {
        this.clear();
      });
    }
  }

  render() {
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
      </form>
    );
  }
}
