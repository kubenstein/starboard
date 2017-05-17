export default class DndSpaceRegistrator {
  constructor(dndManager) {
    this.dndManager = dndManager;
    this.elRef = undefined;
  }

  registerRefAsSpace(el) {
    if (!el) return;

    const containers = this.dndManager.containers;
    if (this.elRef) {
      const i = containers.indexOf(this.elRef);
      containers.slice(i, 1);
    }
    this.elRef = el;
    containers.push(this.elRef);
  }
}
