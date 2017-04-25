import React from 'react';
import Card from 'components/Card/Card.jsx';
import 'components/Column/column.scss';

export default class Column extends React.Component {
  cardsData() {
    return [
      { position: 1, id: 1, title: 'Task1', description: 'Desc 1' },
      { position: 2, id: 2, title: 'Task2', description: 'Desc 2' },
      { position: 3, id: 3, title: 'Task3', description: 'Desc 3' },
      { position: 4, id: 4, title: 'Task4', description: 'Desc 4' },
      { position: 5, id: 5, title: 'Task5', description: 'Desc 5' },
      { position: 6, id: 6, title: 'Task6', description: 'Desc 6' },
      { position: 7, id: 7, title: 'Task7', description: 'Desc 7' },
    ];
  }

  render() {
    const { name } = this.props.data;
    const cardsData = this.cardsData();
    return (
      <div className="column">
        <h3 className="name">{name}</h3>
        <div className="card-list">
          { cardsData.map(data =>
            <Card key={data.id} data={data} />
          )}
        </div>
      </div>
    );
  }
}
