import React from 'react';
import serialize from 'form-serialize';
import ColumnsRepository from 'lib/columns-repository';
import 'components/AddColumnForm/styles.scss';

export default class AddColumnForm extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.repo = new ColumnsRepository(this.stateManager);
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
      this.repo.addColumn(title).then(() => {
        this.close();
      });
    }
  }

  render() {
    const formOpened = this.state.opened;
    return (
      <div className="add-column-form">
        { formOpened ?
          <form
            className="form"
            ref={(e) => { this.formElement = e; }}
            onSubmit={(e) => { this.submit(e); }}
          >
            <input
              className="column-title"
              name="title"
              onKeyPress={(e) => { this.submitFormOnEnter(e); }}
              placeholder="Type a column name..."
              autoFocus
            />
            <input className="btn btn-success" type="submit" value="Add Column" />
            <button className="btn btn-raw-icon" onClick={(e) => { e.preventDefault(); this.close(); }}>✕</button>
          </form>
        :
          <p className="prompt" onClick={() => { this.open(); }}>Add a Column...</p>
        }
      </div>
    );
  }
}
