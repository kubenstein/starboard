import Dragula from 'dragula';

export default class DndColumnsConfigurator {
  constructor(params) {
    this.columnsRepo = params.columnsRepo;
    this.dndHandlerCssClass = params.dndHandlerCssClass;
    this.dndElColumnIdDataAttr = params.dndElColumnIdDataAttr;
  }

  configure() {
    return Dragula([], {
      direction: 'horizontal',
      moves: (_el, _container, handle) => {
        return handle.classList.contains(this.dndHandlerCssClass);
      }
    })
    .on('drop', (el) => {
      const columnId = el.getAttribute(this.dndElColumnIdDataAttr);
      let node = el;
      let newPosition;
      for (newPosition = -1; node; newPosition += 1) { node = node.previousSibling; }

      this.columnsRepo.updateColumn(columnId, { position: newPosition });
    });
  }
}
