import Dragula from 'dragula';

export default class DndCardsConfigurator {
  constructor(params) {
    this.cardsRepo = params.cardsRepo;
    this.dndHandlerCssClass = params.dndHandlerCssClass;
    this.dndElCardIdDataAttr = params.dndElCardIdDataAttr;
    this.dndSpaceColumnIdDataAttr = params.dndSpaceColumnIdDataAttr;
  }

  configure() {
    return Dragula([], {
      moves: (_el, _container, handle) => {
        return handle.classList.contains(this.dndHandlerCssClass);
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
    .on('drop', (el, target) => {
      this.originForDraggableEl.classList.remove('card-dragging');
      if (!target) return; // prevent any further logic when a card
                           // is dropped outside of any container.
                           // Card will go back to original place.

      const cardId = el.getAttribute(this.dndElCardIdDataAttr);
      const newColumnId = target.getAttribute(this.dndSpaceColumnIdDataAttr);
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
}
