import React from 'react';
import AddCardForm from 'components/AddCardForm/AddCardForm.jsx';
import Card from 'components/Card/Card.jsx';
import EdditableInput from 'components/EdditableInput/EdditableInput.jsx';
import CardsRepository from 'lib/cards-repository.js';
import ColumnsRepository from 'lib/columns-repository.js';
import 'components/Column/column.scss';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.columnsRepo = new ColumnsRepository(this.stateManager);
    this.columnData = this.props.data;
  }

  updateName(newName) {
    const oldName = this.columnData.name;
    if (newName !== oldName) {
      this.columnsRepo.updateColumn(this.columnData.id, { name: newName });
    }
  }

  render() {
    const columnData = this.columnData;
    const { name } = this.columnData;
    const cards = this.cardsRepo.getCardsForColumn(columnData.id);
    return (
      <div className="column">
        <EdditableInput value={name} onChange={(value) => { this.updateName(value); }} />
        <div className="card-list">
          { cards.map(card =>
            <Card key={card.id} data={card} stateManager={this.stateManager} />
          )}
        </div>

        <AddCardForm
          column={columnData}
          stateManager={this.stateManager}
        />
      </div>
    );
  }
}
