export default
function updatePositionsOfColumns(currentState) {
  currentState.bucket('columns')
  .sort((c1, c2) => c1.position - c2.position)
  .forEach((c, i) => {
    currentState.updateObject('columns', c.id, { position: i });
  });
}
