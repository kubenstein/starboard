import React from 'react';
import Card from 'components/Card/Card.jsx';
import 'components/Column/column.scss';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  getCards() {
    const bucket = this.store.bucket('cards');
    const column = this.props.data;
    return bucket.filter((c) => {
      return c.columnId === column.id;
    });
  }

  render() {
    const { name } = this.props.data;
    const cards = this.getCards();
    return (
      <div className="column">
        <h3 className="name">{name}</h3>
        <div className="card-list">
          { cards.map(card =>
            <Card key={card.id} data={card} store={this.store} />
          )}
        </div>
      </div>
    );
  }
}
