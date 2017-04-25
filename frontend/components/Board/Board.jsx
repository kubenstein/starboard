import React from 'react';
import Column from 'components/Column/Column.jsx';
import 'components/Board/board.scss';

export default class Board extends React.Component {
  columns() {
    return [
      { position: 1, id: 1, name: 'TODO' },
      { position: 2, id: 2, name: 'DONE' }
    ];
  }

  render() {
    const columns = this.columns();
    return (
      <div className="board clearfix">
        { columns.map(column =>
          <Column className="column" key={column.id} data={column} />
        )}
      </div>
    );
  }
}
