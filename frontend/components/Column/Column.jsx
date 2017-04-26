import React from 'react';
import Card from 'components/Card/Card.jsx';
import 'components/Column/column.scss';

export default class Column extends React.Component {
  render() {
    const { name, cards } = this.props.data;
    return (
      <div className="column">
        <h3 className="name">{name}</h3>
        <div className="card-list">
          { cards.map(card =>
            <Card key={card.id} data={card} />
          )}
        </div>
      </div>
    );
  }
}
