import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { column: { name, id } }) => ({
  cards: deps.get('cardsRepository').cardsSortedByPosition(id),
  onNameUpdate: newName => (newName !== name) && deps.get('columnsRepository').updateColumn(id, { name: newName }),
  onColumnRemove: () => deps.get('columnsRepository').removeColumn(id),
});

export default connect(mapStateToProps)(Component);
