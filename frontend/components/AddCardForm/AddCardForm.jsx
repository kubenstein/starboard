import React from 'react';
import serialize from 'form-serialize';
import 'components/AddCardForm/add-card-form.scss';

export default class AddCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
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

      // add to store...

      console.log(title);
      this.onSuccessCallback();
    }
  }

  render() {
    return (
      <form className="add-card-form" onSubmit={ (e) => { this.submit(e) }}>
        <input className="title" name="title" type="text" placeholder="Type a card title..." autoFocus />
        <input className="btn btn-add" type="submit" value="Add" />
        <button className="btn btn-cancel" onClick={ (e) => { this.close(e) }}>X</button>
      </form>
    );
  }
}
