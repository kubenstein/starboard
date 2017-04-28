export default class ColumnsRepository {
  constructor(store) {
    this.store = store;
  }

  getColumns() {
    const columns = this.store.bucket('columns');
    return columns.sort((c1, c2) => c1.position - c2.position);
  }
}
