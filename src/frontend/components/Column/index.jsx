import React from 'react';
import PropTypes from 'prop-types';
import AddCardForm from 'components/AddCardForm';
import Card from 'components/Card';
import EditableInput from 'components/EditableInput';
import DndSpaceRegistrator from 'components/dndSupport/dnd-space-registrator';
import CardsRepository from 'lib/repositories/cards-repository';
import ColumnsRepository from 'lib/repositories/columns-repository';
import 'components/Column/styles.scss';

export default class Column extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired,
      column: PropTypes.object.isRequired, // TODO replace with shape
      DNDManager: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { stateManager, DNDManager } = this.props;
    this.dndSpaceRegistrator = new DndSpaceRegistrator(DNDManager);
    this.cardsRepo = new CardsRepository(stateManager);
    this.columnsRepo = new ColumnsRepository(stateManager);
  }

  updateName(newName) {
    const { column } = this.props;
    const { name: oldName, id } = column;
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
    const { className } = this.props;
    return `column ${className}`;
  }

  render() {
    const { column, stateManager } = this.props;
    const { name, id } = column;
    const cards = this.cardsRepo.cardsSortedByPosition(id);
    return (
      <div
        className={this.cssClasses()}
        data-DND-data-column-id={id}
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
          data-DND-data-column-id={id}
          ref={(e) => { this.dndSpaceRegistrator.registerRefAsSpace(e); }}
        >
          { cards.map(card =>
            <Card key={card.id} card={card} stateManager={stateManager} />
          )}
        </div>

        <AddCardForm
          columnId={id}
          stateManager={stateManager}
        />
      </div>
    );
  }
}
