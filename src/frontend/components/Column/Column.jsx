import React from 'react';
import AddCardForm from 'components/AddCardForm/AddCardForm';
import Card from 'components/Card/Card';
import EditableInput from 'components/EditableInput/EditableInput';
import DndSpaceRegistrator from 'components/dndSupport/dnd-space-registrator';
import CardsRepository from 'lib/cards-repository';
import ColumnsRepository from 'lib/columns-repository';
import 'components/Column/styles.scss';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.otherCssClasses = this.props.className || '';
    this.dndSpaceRegistrator = new DndSpaceRegistrator(this.props.DNDManager);
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.columnsRepo = new ColumnsRepository(this.stateManager);
    this.columnData = this.props.data;
  }

  updateName(newName) {
    const { name: oldName, id } = this.columnData;
    if (newName !== oldName) {
      this.columnsRepo.updateColumn(id, { name: newName });
    }
  }

  removeColumn(id) {
    if (confirm('Do you want to remove this column?')) {
      this.columnsRepo.removeColumn(id);
    }
  }

  cssClasses() {
    return `column ${this.otherCssClasses}`;
  }

  render() {
    const columnData = this.columnData;
    const { name, id } = this.columnData;
    const cards = this.cardsRepo.cardsSortedByPosition(columnData.id);
    return (
      <div
        className={this.cssClasses()}
        data-DND-data-column-id={columnData.id}
      >
        <div className="clearfix">
          <EditableInput
            className="column-title column-DND-handler"
            value={name}
            onChange={(value) => { this.updateName(value); }}
          />
          <button
            className="btn btn-remove btn-raw-icon"
            title="remove column"
            onClick={() => { this.removeColumn(id); }}
          >✕</button>
        </div>
        <div
          className="card-list"
          data-DND-data-column-id={columnData.id}
          ref={(e) => { this.dndSpaceRegistrator.registerRefAsSpace(e); }}
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
