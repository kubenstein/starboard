import React from 'react';
import Column from 'components/Column/Column.jsx';
import AddColumnForm from 'components/AddColumnForm/AddColumnForm.jsx';
import DndSpaceRegistrator from 'components/dndSupport/dnd-space-registrator.js';
import DndColumnsConfigurator from 'components/dndSupport/dnd-columns-configurator.js';
import DndCardsConfigurator from 'components/dndSupport/dnd-cards-configurator.js';
import ColumnsRepository from 'lib/columns-repository.js';
import CardsRepository from 'lib/cards-repository.js';
import 'components/Board/board.scss';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: [] };
    this.stateManager = props.stateManager;
    this.columnsRepo = new ColumnsRepository(this.stateManager);
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.configureDND();
    this.stateManager.addObserver(this);
  }

  //
  // stateManager observer callback
  onStateUpdate() {
    this.setState({ columns: this.columnsRepo.getColumnsSortedByPosition() });
  }

  configureDND() {
    const columnsDNDManager = this.configureColumnsDND();
    this.dndColumnsSpaceRegistrator = new DndSpaceRegistrator(columnsDNDManager);

    this.cardsDNDManager = this.configureCardsDND();
  }

  configureColumnsDND() {
    return new DndColumnsConfigurator({
      columnsRepo: this.columnsRepo,
      dndHandlerCssClass: 'column-DND-handler',
      dndElColumnIdDataAttr: 'data-DND-data-column-id'
    }).configure();
  }

  configureCardsDND() {
    return new DndCardsConfigurator({
      cardsRepo: this.cardsRepo,
      dndHandlerCssClass: 'card-DND-handler',
      dndElCardIdDataAttr: 'data-DND-data-card-id',
      dndSpaceColumnIdDataAttr: 'data-DND-data-column-id'
    }).configure();
  }

  render() {
    const columns = this.state.columns;
    return (
      <div className="board clearfix">
        <div
          className="columns"
          ref={(e) => { this.dndColumnsSpaceRegistrator.registerRefAsSpace(e); }}
        >
          { columns.map(column =>
            <Column
              className="column column-DND-handler"
              key={column.id}
              data={column}
              DNDManager={this.cardsDNDManager}
              stateManager={this.stateManager}
            />
          )}
        </div>
        <AddColumnForm className="add-column-form" stateManager={this.stateManager} />
      </div>
    );
  }
}
