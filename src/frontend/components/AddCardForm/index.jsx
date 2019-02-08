import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import FunctionLink from 'components/FunctionLink';
import 'components/AddCardForm/styles.scss';

export default class AddCardForm extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
    columnId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { deps } = this.props;
    this.cardsRepo = deps.get('cardsRepository');
    this.uiRepo = deps.get('uiRepository');
  }

  isOpen = () => {
    const { columnId } = this.props;
    return this.uiRepo.get(`cards:addForm:opened:${columnId}`);
  }

  open = () => {
    const { columnId } = this.props;
    this.uiRepo.set(`cards:addForm:opened:${columnId}`, true);
  }

  close = () => {
    const { columnId } = this.props;
    this.uiRepo.set(`cards:addForm:opened:${columnId}`, false);
  }

  submitFormOnEnter = e => (e.key === 'Enter') && this.submit(e);

  submit = (e) => {
    e.preventDefault();
    const { columnId } = this.props;
    const { title } = serialize(this.formElement, { hash: true });
    if (title) {
      this.cardsRepo.addCard(title, columnId)
        .then(() => this.close());
    }
  }

  render() {
    const opened = this.isOpen();
    return (
      <div className="add-card-form">
        { opened ? (
          <form
            className="form"
            ref={(e) => { this.formElement = e; }}
            onSubmit={this.submit}
          >
            <input
              className="card-title"
              name="title"
              autoComplete="off"
              onKeyPress={this.submitFormOnEnter}
              placeholder="Type a card title..."
              autoFocus
            />
            <input className="btn btn-success" type="submit" value="Add" />
            <button
              type="button"
              className="btn btn-raw-icon"
              onClick={this.close}
            >
              ✕
            </button>
          </form>
        ) : (
          <FunctionLink
            component="p"
            className="prompt"
            onClick={this.open}
          >
            Add a Card...
          </FunctionLink>
        )}
      </div>
    );
  }
}
