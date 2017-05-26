export default
function updatePositionOfOtherColumnsAfterColumnRemoval(
  currentState,
  removedColumnPosition
) {
  const columns = currentState.bucket('columns');
  columns.forEach((c) => {
    //
    // move left all columns that were on the right
    // from the removed column
    if (c.position > removedColumnPosition) {
      currentState.updateObject('columns', c.id, { position: c.position - 1 });
    }
  });
}
