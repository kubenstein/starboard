import React from 'react';
import PropTypes from 'prop-types';
import Column from 'components/Column';
import AddColumnForm from 'components/AddColumnForm';
import Topbar from 'components/Topbar';
import DndSpaceRegistrator from 'components/dndSupport/dnd-space-registrator';
import DndColumnsConfigurator from 'components/dndSupport/dnd-columns-configurator';
import DndCardsConfigurator from 'components/dndSupport/dnd-cards-configurator';
import 'components/Board/styles.scss';

export default class Board extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.deps = props.deps;
    this.columnsRepo = this.deps.get('columnsRepository');
    this.cardsRepo = this.deps.get('cardsRepository');
    this.themeStyler = this.deps.get('themeStyler');
    this.configureDND();
    this.state = {
      loaded: false,
      columns: [],
    };
  }

  componentWillMount() {
    const stateManager = this.deps.get('stateManager');
    stateManager.addObserver(this);
  }


  componentWillUnmount() {
    const stateManager = this.deps.get('stateManager');
    stateManager.removeObserver(this);
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
    return (
      <div className="board-wrapper">
        <style>{this.themeStyler.generateStyles()}</style>
        <div className={`board ${this.additionalCssClass()}`}>
          <Topbar className="topbar" deps={this.deps} />
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
                  stateManager={this.deps.get('stateManager')}
                />,
              )}
            </div>
            <AddColumnForm
              className="column add-column-form"
              deps={this.deps}
            />
          </div>
        </div>
      </div>
    );
  }
}
