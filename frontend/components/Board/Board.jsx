import React from 'react';
import Column from 'components/Column/Column.jsx';
import Store from 'lib/Store.js';
import 'components/Board/board.scss';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
    this.store = new Store();
  }

  componentDidMount() {
    this.store.addObserver(this);
  }

  onStoreUpdate() {
    this.setState({ columns: this.store.bucket('columns') });
  }

  sortedColumns() {
    const columns = this.state.columns;
    return columns.sort((c1, c2) => c1.position - c2.position);
  }

  render() {
    const columns = this.sortedColumns();
    return (
      <div className="board clearfix">
        { columns.map(column =>
          <Column className="column" key={column.id} data={column} store={this.store} />
        )}
      </div>
    );
  }
}
