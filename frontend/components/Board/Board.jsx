import React from 'react';
import Column from 'components/Column/Column.jsx';
import EventStore from 'lib/event-store.js';
import ColumnsRepository from 'lib/columns-repository.js';
import 'components/Board/board.scss';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
    this.store = new EventStore();
    this.repo = new ColumnsRepository(this.store);
  }

  componentDidMount() {
    this.store.addObserver(this);
  }

  onStoreUpdate() {
    this.setState({ columns: this.repo.getColumns() });
  }

  render() {
    const columns = this.state.columns;
    return (
      <div className="board clearfix">
        { columns.map(column =>
          <Column className="column" key={column.id} data={column} store={this.store} />
        )}
      </div>
    );
  }
}
