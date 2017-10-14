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
    this.stateManager = this.deps.get('stateManager');
    this.columnsRepo = this.deps.get('columnsRepository');
    this.cardsRepo = this.deps.get('cardsRepository');
    this.cardsRepo = this.deps.get('cardsRepository');
    this.settingsRepo = this.deps.get('settingsRepository');
    this.themeStyler = this.deps.get('themeStyler');
    this.uiRepo = this.deps.get('uiRepository');
    this.browserSettingsService = this.deps.get('browserSettingsService');
    this.configureDND();
    this.state = {
      columns: [],
    };
  }

  componentWillMount() {
    this.stateManager.addObserver(this);
    this.markOpenedCardFromUrl();
  }

  componentWillUnmount() {
    this.stateManager.removeObserver(this);
  }

  //
  // stateManager observer callback
  onStateUpdate() {
    this.setState({
      columns: this.columnsRepo.columnsSortedByPosition(),
    });

    if (!this.uiRepo.get('storage:loaded')) {
      this.uiRepo.set('storage:loaded', true);
    }

    this.setPageTitle();
    this.setPageUrl();
  }

  // private

  setPageTitle() {
    const boardName = this.settingsRepo.boardName() || 'Starboard';
    this.browserSettingsService.setTitle(boardName);
  }

  setPageUrl() {
    const openedCardId = this.uiRepo.get('card:openedId');
    this.browserSettingsService.setUrlForCard(openedCardId);
  }

  markOpenedCardFromUrl() {
    const cardIdFromUrl = this.browserSettingsService.urlCardId();
    this.uiRepo.set('card:openedId', cardIdFromUrl);
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

  renderLoadedBoard() {
    const { columns } = this.state;
    return (
      <div className="board">
        <Topbar className="topbar" deps={this.deps} />
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
                deps={this.deps}
              />,
            )}
          </div>

          <AddColumnForm
            className="column add-column-form"
            deps={this.deps}
          />
        </div>
      </div>
    );
  }

  renderLoadingBoard() {
    return (
      <div className="board">
        <div className="bg-wrapper">
          <p className="loading-text">Loading Board...</p>
        </div>
      </div>
    );
  }

  render() {
    const loaded = this.uiRepo.get('storage:loaded');
    return (
      <div className="board-wrapper">
        <style>{this.themeStyler.generateStyles()}</style>
        { loaded ?
          this.renderLoadedBoard()
        :
          this.renderLoadingBoard()
        }
      </div>
    );
  }
}
