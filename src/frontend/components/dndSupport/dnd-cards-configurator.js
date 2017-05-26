import Dragula from 'dragula';
import positionAmongDOMSiblings from './position-among-dom-siblings.js';

export default class DndCardsConfigurator {
  constructor(params) {
    this.cardsRepo = params.cardsRepo;
    this.dndHandlerCssClass = params.dndHandlerCssClass;
    this.dndElCardIdDataAttr = params.dndElCardIdDataAttr;
    this.dndSpaceColumnIdDataAttr = params.dndSpaceColumnIdDataAttr;
  }

  configure() {
    return this.setup()
               .on('drag', (el) => { this.onDragStart(el); })
               .on('drop', (el, target) => { this.onDrop(el, target); });
  }

  // private

  setup() {
    return Dragula([], {
      moves: (_el, _container, handle) => {
        return handle.classList.contains(this.dndHandlerCssClass);
      },
      copy: true, // Instruct Dragula to copy dragged element, so it will still persist on an old column.
                  // It has to stay there so React can clean it in its react-ish way.
                  // The source element (this.sourceDraggedEl) will be hidden by css.
      copySortSource: true
    });
  }

  onDragStart(el) {
    this.sourceDraggedEl = el;
    setTimeout(() => { // Source element has to be hidden by css, however
                       // draggable clone el dimentions are calculated based
                       // on source element dimentions. so the source el
                       // has to be visible during that calculation.
                       // We postpone applying css class via setTimeout(..., 0)
      this.sourceDraggedEl.classList.add('card-dragging');
    }, 0);
  }

  onDrop(el, target) {
    this.sourceDraggedEl.classList.remove('card-dragging');
    if (!target) return; // No target means draggable element was dropped outside
                         // of any container. Return due to no meaningful dnd.

    const cardId = el.getAttribute(this.dndElCardIdDataAttr);
    const newColumnId = target.getAttribute(this.dndSpaceColumnIdDataAttr);
    const oldColumnId = this.cardsRepo.get(cardId).columnId;
    const newPosition = positionAmongDOMSiblings(el);
    this.cardsRepo.updateCard(cardId, { columnId: newColumnId, position: newPosition });

    //
    // On a succesful drop, Dragula removes old element and inserts new one.
    // Old removed element is an React component, we keep it in this.sourceDraggedEl.
    // New inserted element is jsut a pure html copy of original so not a React component.
    // We have to insert again a React component to DOM (and we do it on proper position,
    // where the new inserted element is) so DOM <-> React are still in sync.
    // We have to do it only when we dnd in same column because when we move to the other
    // colum, a card SUPPOSED to be removed from DOM, and Dragula does (before React).
    if (newColumnId === oldColumnId) {
      el.parentNode.insertBefore(this.sourceDraggedEl, el);
    }

    //
    // Remove element inserted by Dragula becasue:
    // 1) it is just a html element and not React component
    // 2) a card data was updated to refect the move,
    //    so React will insert that card during next rerender
    el.remove();
  }
}
