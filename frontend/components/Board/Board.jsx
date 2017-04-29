import React from 'react';
import Column from 'components/Column/Column.jsx';
import ColumnsRepository from 'lib/columns-repository.js';
import 'components/Board/board.scss';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
    this.eventStore = props.eventStore;
    this.repo = new ColumnsRepository(this.eventStore);
  }

  componentDidMount() {
    this.eventStore.addObserver(this);
    this.syncState();
  }

  onStoreUpdate() {
    this.syncState();
  }

  syncState() {
    this.setState({ columns: this.repo.getColumns() });
  }

  render() {
    const columns = this.state.columns;
    return (
      <div className="board clearfix">
        { columns.map(column =>
          <Column className="column" key={column.id} data={column} eventStore={this.eventStore} />
        )}
      </div>
    );
  }
}
