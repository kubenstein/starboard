import React from 'react';
import PropTypes from 'prop-types';
import Column from 'components/Column';
import AddColumnForm from 'components/AddColumnForm';
import Topbar from 'components/Topbar';
import DndSpaceRegistrator from 'lib/dndSupport/dnd-space-registrator';
import DndColumnsConfigurator from 'lib/dndSupport/dnd-columns-configurator';
import DndCardsConfigurator from 'lib/dndSupport/dnd-cards-configurator';
import 'components/Board/styles.scss';

export default class Board extends React.Component {
  static propTypes = {
    deps: PropTypes.shape().isRequired,
    state: PropTypes.shape().isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape()),
    themeCSSStyles: PropTypes.string,
    rehydrateOpenedCardFromUrl: PropTypes.func.isRequired,
    updatePageTitle: PropTypes.func.isRequired,
    updatePageUrl: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { state, rehydrateOpenedCardFromUrl } = this.props;
    state.addObserver(this);
    this.configureDND();
    rehydrateOpenedCardFromUrl();
  }

  componentWillUnmount() {
    const { state } = this.props;
    state.removeObserver(this);
  }

  //
  // stateManager observer callback
  onStateUpdate() {
    const { updatePageTitle, updatePageUrl } = this.props;
    updatePageTitle();
    updatePageUrl();
  }

  // private

  configureDND() {
    const columnsDNDManager = this.configureColumnsDND();
    this.dndColumnsSpaceRegistrator = new DndSpaceRegistrator(columnsDNDManager);

    this.cardsDNDManager = this.configureCardsDND();
  }

  configureColumnsDND() {
    const { deps } = this.props;
    return new DndColumnsConfigurator({
      columnsRepo: deps.get('columnsRepository'),
      dndHandlerCssClass: 'column-DND-handler',
      dndElColumnIdDataAttr: 'data-dnd-data-column-id',
    }).configure();
  }

  configureCardsDND() {
    const { deps } = this.props;
    return new DndCardsConfigurator({
      cardsRepo: deps.get('cardsRepository'),
      dndHandlerCssClass: 'card-DND-handler',
      dndElCardIdDataAttr: 'data-dnd-data-card-id',
      dndSpaceColumnIdDataAttr: 'data-dnd-data-column-id',
    }).configure();
  }

  render() {
    const { columns, themeCSSStyles } = this.props;
    return (
      <div className="board-wrapper">
        <style>{themeCSSStyles}</style>
        <div className="board">
          <Topbar className="topbar" />
          <div className="bg-wrapper">
            <div
              className="columns"
              ref={(e) => { this.dndColumnsSpaceRegistrator.registerRefAsSpace(e); }}
            >
              { columns.map(column => (
                <Column
                  className="column column-DND-handler"
                  key={column.id}
                  column={column}
                  DNDManager={this.cardsDNDManager}
                />
              ))}
            </div>

            <AddColumnForm className="column add-column-form" />
          </div>
        </div>
      </div>
    );
  }
}
