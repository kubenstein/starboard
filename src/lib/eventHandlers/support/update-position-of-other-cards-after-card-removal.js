export default
function updatePositionOfOtherCardsAfterCardRemoval(
  currentState,
  removedCardColumnId,
  removedCardPosition
) {
  const cards = currentState.bucket('cards')
                            .filter(c => c.columnId === removedCardColumnId);
  cards.forEach((c) => {
    //
    // move up all cards that were under the removed card
    if (c.position > removedCardPosition) {
      currentState.updateObject('cards', c.id, { position: c.position - 1 });
    }
  });
}
