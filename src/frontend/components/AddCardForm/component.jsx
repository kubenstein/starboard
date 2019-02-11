import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import FunctionLink from 'components/FunctionLink';
import 'components/AddCardForm/styles.scss';

export default class AddCardForm extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    addCard: PropTypes.func.isRequired,
  }

  submitFormOnEnter = e => (e.key === 'Enter') && this.submit(e);

  submit = (e) => {
    e.preventDefault();
    const { addCard, onClose } = this.props;
    const { title } = serialize(this.formElement, { hash: true });
    if (title) {
      addCard(title).then(() => onClose());
    }
  }

  render() {
    const { isOpen, onOpen, onClose } = this.props;
    return (
      <div className="add-card-form">
        { isOpen ? (
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
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            />
            <input className="btn btn-success" type="submit" value="Add" />
            <button
              type="button"
              className="btn btn-raw-icon"
              onClick={(e) => { e.preventDefault(); onClose(); }}
            >
              ✕
            </button>
          </form>
        ) : (
          <FunctionLink
            component="p"
            className="prompt"
            onClick={onOpen}
          >
            Add a Card...
          </FunctionLink>
        )}
      </div>
    );
  }
}
