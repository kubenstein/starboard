export default class ColumnsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getColumns() {
    const columns = this.stateManager.bucket('columns');
    return columns.sort((c1, c2) => c1.position - c2.position);
  }
}
