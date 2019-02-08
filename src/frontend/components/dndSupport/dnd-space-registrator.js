export default class DndSpaceRegistrator {
  constructor(dndManager) {
    this.dndManager = dndManager;
    this.elRef = undefined;
  }

  registerRefAsSpace(el) {
    if (!el) return;

    const { containers } = this.dndManager;
    if (this.elRef) {
      this.remove(this.elRef, containers);
    }
    this.elRef = el;
    containers.push(this.elRef);
  }

  // private

  remove(item, collection) {
    const i = collection.indexOf(item);
    collection.slice(i, 1);
  }
}
