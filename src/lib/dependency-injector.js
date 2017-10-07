export default class DependencyInjector {
  constructor() {
    this.objects = {};
    this.executors = {};
  }

  set(name, executor) {
    this.executors[name] = executor;
    return this;
  }

  get(name) {
    if (!this.objects[name]) {
      const executor = this.executors[name];
      if (!executor) throw new Error(`Dependency "${name}" was never set.`);
      this.objects[name] = this.executors[name](this);
    }

    return this.objects[name];
  }
}
