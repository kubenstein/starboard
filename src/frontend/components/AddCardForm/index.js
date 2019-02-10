import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { columnId }) => ({
  isOpen: deps.get('uiRepository').get(`cards:addForm:opened:${columnId}`),
  onOpen: () => deps.get('uiRepository').set(`cards:addForm:opened:${columnId}`, true),
  onClose: () => deps.get('uiRepository').set(`cards:addForm:opened:${columnId}`, false),
  addCard: title => deps.get('cardsRepository').addCard(title, columnId),
});

export default connect(mapStateToProps)(Component);
