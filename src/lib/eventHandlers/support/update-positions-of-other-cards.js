export default
function updatePositionsOfCards(currentState, columnId) {
  currentState.bucket('cards')
  .filter(c => c.columnId === columnId)
  .sort((c1, c2) => c1.position - c2.position)
  .forEach((c, i) => {
    currentState.updateObject('cards', c.id, { position: i });
  });
}
