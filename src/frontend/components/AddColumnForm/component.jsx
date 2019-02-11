import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import FunctionLink from 'components/FunctionLink';

import 'components/AddColumnForm/styles.scss';

export default class AddColumnForm extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    addColumn: PropTypes.func.isRequired,
  }

  onClose = (e) => {
    e.preventDefault();
    const { onClose } = this.props;
    onClose();
  }

  submitFormOnEnter = e => (e.key === 'Enter') && this.submit(e);

  submit = (e) => {
    e.preventDefault();
    const { addColumn } = this.props;
    const { title } = serialize(this.formElement, { hash: true });
    if (title) {
      addColumn(title).then(() => this.onClose());
    }
  }

  render() {
    const { isOpen, onOpen, onClose } = this.props;
    return (
      <div className="add-column-form">
        { isOpen ? (
          <form
            className="form"
            ref={(e) => { this.formElement = e; }}
            onSubmit={this.submit}
          >
            <input
              className="column-title"
              name="title"
              onKeyPress={this.submitFormOnEnter}
              placeholder="Type a column name..."
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            />
            <input className="btn btn-success" type="submit" value="Add Column" />
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
            Add a Column...
          </FunctionLink>
        )}
      </div>
    );
  }
}
