export default
function updatePositionOfOtherCardsAfterCardRemoval(
  currentState,
  removedCardColumnId,
  removedCardPosition
) {
  const cards = currentState.bucket('cards')
                            .filter(c => c.columnId === removedCardColumnId);
  cards.forEach((c) => {
    if (c.position > removedCardPosition) {
      currentState.updateObject('cards', c.id, { position: c.position - 1 });
    }
  });
}
