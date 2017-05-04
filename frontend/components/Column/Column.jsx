import React from 'react';
import AddCardForm from 'components/AddCardForm/AddCardForm.jsx';
import Card from 'components/Card/Card.jsx';
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

  onNameEditPressEnter(e) {
    if (e.key === 'Enter') {
      this.nameInput.blur();
      this.updateName();
    }
  }

  onNameEditBlur() {
    this.updateName();
  }

  updateName() {
    const newName = this.nameInput.value;
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
        <input
          type="text"
          className="name-input"
          defaultValue={name}
          ref={(e) => { this.nameInput = e; }}
          onBlur={() => { this.onNameEditBlur(); }}
          onKeyPress={(e) => { this.onNameEditPressEnter(e); }}
        />
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
