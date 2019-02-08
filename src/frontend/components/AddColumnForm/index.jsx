import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import FunctionLink from 'components/FunctionLink';

import 'components/AddColumnForm/styles.scss';

export default class AddColumnForm extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const deps = this.props.deps;
    this.columnsRepo = deps.get('columnsRepository');
    this.uiRepo = deps.get('uiRepository');
  }

  isOpen = () => this.uiRepo.get('columns:addForm:opened');

  open = () => this.uiRepo.set('columns:addForm:opened', true);

  close = (e) => {
    e.preventDefault();
    this.uiRepo.set('columns:addForm:opened', false);
  }

  submitFormOnEnter = e => (e.key === 'Enter') && this.submit(e);

  submit = (e) => {
    e.preventDefault();
    const { title } = serialize(this.formElement, { hash: true });
    if (title) {
      this.columnsRepo.addColumn(title)
        .then(() => this.close());
    }
  }

  render() {
    const opened = this.isOpen();
    return (
      <div className="add-column-form">
        { opened ? (
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
              autoFocus
            />
            <input className="btn btn-success" type="submit" value="Add Column" />
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
            Add a Column...
          </FunctionLink>
        )}
      </div>
    );
  }
}
