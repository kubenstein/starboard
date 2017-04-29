import React from 'react';
import Column from 'components/Column/Column.jsx';
import ColumnsRepository from 'lib/columns-repository.js';
import 'components/Board/board.scss';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
    this.stateManager = props.stateManager;
    this.repo = new ColumnsRepository(this.stateManager);
  }

  componentDidMount() {
    this.stateManager.addObserver(this);
  }

  onStateUpdate() {
    this.setState({ columns: this.repo.getColumns() });
  }

  render() {
    const columns = this.state.columns;
    return (
      <div className="board clearfix">
        { columns.map(column =>
          <Column className="column" key={column.id} data={column} stateManager={this.stateManager} />
        )}
      </div>
    );
  }
}
