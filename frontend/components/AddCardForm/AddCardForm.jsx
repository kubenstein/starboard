import React from 'react';
import serialize from 'form-serialize';
import CardsRepository from 'lib/cards-repository.js';
import 'components/AddCardForm/add-card-form.scss';

export default class AddCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.column = this.props.column;
    this.stateManager = this.props.stateManager;
    this.repo = new CardsRepository(this.stateManager);
    this.onCancelCallback = this.props.onCancel;
    this.onSuccessCallback = this.props.onSuccess;
  }

  close(e) {
    e.preventDefault();
    this.onCancelCallback();
  }

  submitFormOnEnter(e) {
    if (e.key === 'Enter') {
      this.submit(e);
    }
  }

  submit(e) {
    e.preventDefault();
    const { title } = serialize(this.formElement, { hash: true });
    if (title) {
      this.repo.addCard(title, this.column.id).then(() => {
        this.onSuccessCallback();
      });
    }
  }

  render() {
    return (
      <form
        className="add-card-form"
        ref={(e) => { this.formElement = e; }}
        onSubmit={(e) => { this.submit(e); }}
      >
        <textarea
          className="title"
          name="title"
          onKeyPress={(e) => { this.submitFormOnEnter(e); }}
          placeholder="Type a card title..."
          autoFocus
        />
        <input className="btn btn-add" type="submit" value="Add" />
        <button className="btn btn-cancel" onClick={(e) => { this.close(e); }}>X</button>
      </form>
    );
  }
}
