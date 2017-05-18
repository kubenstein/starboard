import Dragula from 'dragula';
import positionAmongDOMSiblings from './position-among-dom-siblings.js';

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
    const newPosition = positionAmongDOMSiblings(el);
    this.columnsRepo.updateColumn(columnId, { position: newPosition });
  }
}
