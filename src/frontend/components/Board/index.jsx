import React from 'react';
import PropTypes from 'prop-types';
import Column from 'components/Column';
import AddColumnForm from 'components/AddColumnForm';
import Topbar from 'components/Topbar';
import DndSpaceRegistrator from 'components/dndSupport/dnd-space-registrator';
import DndColumnsConfigurator from 'components/dndSupport/dnd-columns-configurator';
import DndCardsConfigurator from 'components/dndSupport/dnd-cards-configurator';
import ThemeStyler from 'components/Board/theme-styler';
import ColumnsRepository from 'lib/repositories/columns-repository';
import CardsRepository from 'lib/repositories/cards-repository';
import 'components/Board/styles.scss';

export default class Board extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { stateManager } = this.props;
    this.columnsRepo = new ColumnsRepository(stateManager);
    this.cardsRepo = new CardsRepository(stateManager);
    this.themeStyler = new ThemeStyler(stateManager);
    this.configureDND();
    stateManager.addObserver(this);
    this.state = {
      loaded: false,
      columns: [],
    };
  }

  //
  // stateManager observer callback
  onStateUpdate() {
    this.setState({
      loaded: true,
      columns: this.columnsRepo.columnsSortedByPosition(),
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
      dndElColumnIdDataAttr: 'data-DND-data-column-id',
    }).configure();
  }

  configureCardsDND() {
    return new DndCardsConfigurator({
      cardsRepo: this.cardsRepo,
      dndHandlerCssClass: 'card-DND-handler',
      dndElCardIdDataAttr: 'data-DND-data-card-id',
      dndSpaceColumnIdDataAttr: 'data-DND-data-column-id',
    }).configure();
  }

  additionalCssClass() {
    return this.state.loaded ? '' : 'loading';
  }

  render() {
    const { columns } = this.state;
    const { stateManager } = this.props;
    return (
      <div className="board-wrapper">
        <style>{this.themeStyler.generateStyles()}</style>
        <div className={`board ${this.additionalCssClass()}`}>
          <Topbar className="topbar" stateManager={stateManager} />
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
                  column={column}
                  DNDManager={this.cardsDNDManager}
                  stateManager={stateManager}
                />,
              )}
            </div>
            <AddColumnForm className="column add-column-form" stateManager={stateManager} />
          </div>
        </div>
      </div>
    );
  }
}
