export default
function repositionAllCards(currentState, columnId) {
  currentState.bucket('cards')
    .filter(c => c.columnId === columnId)
    .reverse() // reverse to put first newer element if positions are equal
    .sort((c1, c2) => c1.position - c2.position)
    .forEach((c, i) => {
      currentState.updateObject('cards', c.id, { position: i });
    });
}
