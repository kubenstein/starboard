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
    this.DNDManager = this.props.DNDManager;
    this.otherCssClasses = this.props.className || '';
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

  addCardsDNDContainer(el) {
    if (!el) return;
    if (this.DNDContainer) {
      const i = this.DNDManager.containers.indexOf(this.DNDContainer);
      this.DNDManager.containers.slice(i, 1);
    }
    this.DNDContainer = el;
    this.DNDManager.containers.push(this.DNDContainer);
  }

  cssClasses() {
    return `column ${this.otherCssClasses}`;
  }

  render() {
    const columnData = this.columnData;
    const { name } = this.columnData;
    const cards = this.cardsRepo.getCardsSortedByPosition(columnData.id);
    return (
      <div
        className={this.cssClasses()}
        data-DND-data-column-id={columnData.id}
      >
        <EdditableInput
          className="column-DND-handler"
          value={name}
          onChange={(value) => { this.updateName(value); }}
        />
        <div
          className="card-list"
          data-DND-data-column-id={columnData.id}
          ref={(e) => { this.addCardsDNDContainer(e); }}
        >
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
