import React from 'react';
import Column from 'components/Column';
import AddColumnForm from 'components/AddColumnForm';
import Topbar from 'components/Topbar';
import DndSpaceRegistrator from 'components/dndSupport/dnd-space-registrator';
import DndColumnsConfigurator from 'components/dndSupport/dnd-columns-configurator';
import DndCardsConfigurator from 'components/dndSupport/dnd-cards-configurator';
import ThemeStyler from 'components/Board/theme-styler';
import ColumnsRepository from 'lib/columns-repository';
import CardsRepository from 'lib/cards-repository';
import 'components/Board/styles.scss';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = props.stateManager;
    this.columnsRepo = new ColumnsRepository(this.stateManager);
    this.cardsRepo = new CardsRepository(this.stateManager);
    this.themeStyler = new ThemeStyler(this.stateManager);
    this.configureDND();
    this.stateManager.addObserver(this);
    this.state = {
      loaded: false,
      columns: []
    };
  }

  //
  // stateManager observer callback
  onStateUpdate() {
    this.setState({
      loaded: true,
      columns: this.columnsRepo.columnsSortedByPosition()
    });
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

  additionalCssClass() {
    return this.state.loaded ? '' : 'loading';
  }

  render() {
    const { columns } = this.state;
    return (
      <div className="board-wrapper">
        <style>{this.themeStyler.generateStyles()}</style>
        <div className={`board ${this.additionalCssClass()}`}>
          <Topbar className="topbar" stateManager={this.stateManager} />
          <p className="loading-text">Loading Board...</p>
          <div className="bg-wrapper">
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
            <AddColumnForm className="column add-column-form" stateManager={this.stateManager} />
          </div>
        </div>
      </div>
    );
  }
}
