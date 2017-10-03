import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import CardsRepository from 'lib/repositories/cards-repository';
import 'components/AddCardForm/styles.scss';

export default class AddCardForm extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired,
      columnId: PropTypes.string.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { stateManager } = this.props;
    this.repo = new CardsRepository(stateManager);
    this.state = {
      opened: false
    };
  }

  open() {
    this.setState({ opened: true });
  }

  close() {
    this.setState({ opened: false });
  }

  submitFormOnEnter(e) {
    if (e.key === 'Enter') {
      this.submit(e);
    }
  }

  submit(e) {
    e.preventDefault();
    const { columnId } = this.props;
    const { title } = serialize(this.formElement, { hash: true });
    if (title) {
      this.repo.addCard(title, columnId).then(() => {
        this.close();
      });
    }
  }

  render() {
    const { opened } = this.state;
    return (
      <div className="add-card-form">
        { opened ?
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
