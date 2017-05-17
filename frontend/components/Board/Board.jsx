import React from 'react';
import Dragula from 'dragula';
import Column from 'components/Column/Column.jsx';
import AddColumnForm from 'components/AddColumnForm/AddColumnForm.jsx';
import DndSpaceRegistrator from 'components/dndSupport/dnd-space-registrator.js';
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
    this.dndSpaceRegistrator = new DndSpaceRegistrator(columnsDNDManager);

    this.cardsDNDManager = this.configureCardsDND();
  }

  configureColumnsDND() {
    return Dragula([], {
      direction: 'horizontal',
      moves: (_el, _container, handle) => {
        return handle.classList.contains('column-DND-handler');
      }
    })
    .on('drop', (el, _target) => {
      const columnId = el.getAttribute('data-DND-data-column-id');
      let node = el;
      let newPosition;
      for (newPosition = -1; node; newPosition += 1) { node = node.previousSibling; }
      this.columnsRepo.updateColumn(columnId, { position: newPosition });
    });
  }

  configureCardsDND() {
    return Dragula([], {
      moves: (_el, _container, handle) => {
        return handle.classList.contains('card-DND-handler');
      },
      copy: true, // set copy so element still persist in old column,
                  // it has to stay there so React can clean it in its way
      copySortSource: true
    })
    .on('drag', (el) => {
      this.originForDraggableEl = el;
      setTimeout(() => { // we want to apply css that hides copied element
                         // that is kept in old column, but draggable element
                         // dimentions is somehow calculated via css,
                         // so we cant hide element before calculation,
                         // thats why we postpone adding the class
        this.originForDraggableEl.classList.add('card-dragging');
      }, 0);
    })
    .on('drop', (el, target, source) => {
      this.originForDraggableEl.classList.remove('card-dragging');
      if (!target) return; // prevent any further logic when a card
                           // is dropped outside of any container.
                           // Card will go back to original place.

      const cardId = el.getAttribute('data-DND-data-card-id');
      const newColumnId = target.getAttribute('data-DND-data-column-id');
      const oldColumnId = this.cardsRepo.getCard(cardId).columnId;
      let node = el;
      let newPosition;
      for (newPosition = -1; node; newPosition += 1) { node = node.previousSibling; }
      this.cardsRepo.updateCard(cardId, { columnId: newColumnId, position: newPosition });

      // when we move card inside same container,
      // we reposition original React component based on
      // droped pure html copy of it, then we remove the dragable copy
      if (newColumnId === oldColumnId) {
        el.parentNode.insertBefore(this.originForDraggableEl, el);
      }
      el.remove(); // remove cloned non-react html element
    });
  }

  render() {
    const columns = this.state.columns;
    return (
      <div className="board clearfix">
        <div
          className="columns"
          ref={(e) => { this.dndSpaceRegistrator.registerRefAsSpace(e); }}
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
