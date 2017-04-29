import React from 'react';
import serialize from 'form-serialize';
import CardsRepository from 'lib/cards-repository.js';
import 'components/AddCardForm/add-card-form.scss';

export default class AddCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.column = this.props.column;
    this.eventStore = this.props.eventStore;
    this.repo = new CardsRepository(this.eventStore);
    this.onCancelCallback = this.props.onCancel;
    this.onSuccessCallback = this.props.onSuccess;
  }

  close(e) {
    e.preventDefault();
    this.onCancelCallback();
  }

  submit(e) {
    e.preventDefault();
    const { title } = serialize(e.target, { hash: true });
    if (title) {
      this.repo.addCard(title, this.column.id).then(() => {
        this.onSuccessCallback();
      });
    }
  }

  render() {
    return (
      <form className="add-card-form" onSubmit={(e) => { this.submit(e); }}>
        <textarea className="title" name="title" type="text" placeholder="Type a card title..." autoFocus />
        <input className="btn btn-add" type="submit" value="Add" />
        <button className="btn btn-cancel" onClick={(e) => { this.close(e); }}>X</button>
      </form>
    );
  }
}
