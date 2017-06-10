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
    this.state = {
      opened: false
    };
  }

  close() {
    this.setState({ opened: false });
  }

  open() {
    this.setState({ opened: true });
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
        this.close();
      });
    }
  }

  render() {
    const formOpened = this.state.opened;
    return (
      <div className="add-card-form">
        { formOpened ?
          <form
            className="form"
            ref={(e) => { this.formElement = e; }}
            onSubmit={(e) => { this.submit(e); }}
          >
            <input
              className="card-title"
              name="title"
              autoComplete="off"
              onKeyPress={(e) => { this.submitFormOnEnter(e); }}
              placeholder="Type a card title..."
              autoFocus
            />
            <input className="btn btn-success" type="submit" value="Add" />
            <button className="btn btn-raw-icon" onClick={(e) => { e.preventDefault(); this.close(); }}>✕</button>
          </form>
        :
          <p className="prompt" onClick={() => { this.open(); }}>Add a Card...</p>
        }
      </div>
    );
  }
}
