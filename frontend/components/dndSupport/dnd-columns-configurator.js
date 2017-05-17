import Dragula from 'dragula';

export default class DndColumnsConfigurator {
  constructor(params) {
    this.columnsRepo = params.columnsRepo;
    this.dndHandlerCssClass = params.dndHandlerCssClass;
    this.dndElColumnIdDataAttr = params.dndElColumnIdDataAttr;
  }

  configure() {
    return this.setup()
               .on('drop', (el) => { this.onDrop(el); });
  }

  // private

  setup() {
    return Dragula([], {
      direction: 'horizontal',
      moves: (_el, _container, handle) => {
        return handle.classList.contains(this.dndHandlerCssClass);
      }
    });
  }

  onDrop(el) {
    const columnId = el.getAttribute(this.dndElColumnIdDataAttr);
    const newPosition = this.positionAmongDOMSiblings(el);
    this.columnsRepo.updateColumn(columnId, { position: newPosition });
  }

  positionAmongDOMSiblings(el) {
    let node = el;
    let position;
    for (position = -1; node; position += 1) { node = node.previousSibling; }
    return position;
  }
}
