import React from 'react';
import AddCardForm from 'components/AddCardForm/AddCardForm.jsx';
import Card from 'components/Card/Card.jsx';
import CardsRepository from 'lib/cards-repository.js';
import 'components/Column/column.scss';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.state = { addFormOpened: false };
    this.repo = new CardsRepository(this.stateManager);
  }

  toggleAddForm() {
    this.setState({ addFormOpened: !this.state.addFormOpened });
  }

  render() {
    const columnData = this.props.data;
    const { name } = columnData;
    const { addFormOpened } = this.state;
    const cards = this.repo.getCardsForColumn(columnData.id);
    return (
      <div className="column">
        <h3 className="name">{name}</h3>
        <div className="card-list">
          { cards.map(card =>
            <Card key={card.id} data={card} stateManager={this.stateManager} />
          )}
        </div>

        <div className="add-card">
          { addFormOpened ?
            <AddCardForm
              onCancel={() => { this.toggleAddForm(); }}
              onSuccess={() => { this.toggleAddForm(); }}
              column={columnData}
              stateManager={this.stateManager}
            />
          :
            <p
              className="bottom-additional clickable"
              onClick={() => { this.toggleAddForm(); }}
            >Add a Card...</p>
          }
        </div>
      </div>
    );
  }
}
