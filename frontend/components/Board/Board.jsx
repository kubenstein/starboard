import React from 'react';
import Column from 'components/Column/Column.jsx';
import 'components/Board/board.scss';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: []}

    let data = [
      {
        position: 1,
        id: 1,
        name: 'TODO',
        cards: [
          {
            position: 1,
            id: 1,
            title: 'Task1',
            description: 'Desc 1',
            comments: [
              { id: 1, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 1' },
              { id: 2, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 2' }
            ]
          },
          {
            position: 2,
            id: 2,
            title: 'Task2',
            description: 'Desc 2',
            comments: [
              { id: 3, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 3' },
              { id: 4, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 4' }
            ]
          },
          {
            position: 3,
            id: 3,
            title: 'Task3',
            description: 'Desc 3',
            comments: [
              { id: 5, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 5' },
              { id: 6, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 6' }
            ]
          },
          {
            position: 4,
            id: 4,
            title: 'Task4',
            description: 'Desc 4',
            comments: [
              { id: 7, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 7' },
              { id: 8, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 8' }
            ]
          },
          {
            position: 5,
            id: 5,
            title: 'Task5',
            description: 'Desc 5',
            comments: [
              { id: 9, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 9' },
              { id: 10, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 10' }
            ]
          },
          {
            position: 6,
            id: 6,
            title: 'Task6',
            description: 'Desc 6',
            comments: [
              { id: 11, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 11' },
              { id: 12, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 12' }
            ]
          },
          {
            position: 7,
            id: 7,
            title: 'Task7',
            description: 'Desc 7',
            comments: [
              { id: 13, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 13' },
              { id: 14, author: { name: 'Kuba N', email: 'niewczas.jakub@gmail.com' }, content: 'comment 14' }
            ]
          },
        ]
      }
    ];

    setTimeout(() => {
      this.setState({ columns: data })
    }, 2000)
  }

  render() {
    const columns = this.state.columns;
    return (
      <div className="board clearfix">
        { columns.map(column =>
          <Column className="column" key={column.id} data={column} />
        )}
      </div>
    );
  }
}
