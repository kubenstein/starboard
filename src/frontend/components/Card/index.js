import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { card: { id } }) => ({
  isOpen: deps.get('uiRepository').get('card:openedId') === id,
  commentCount: deps.get('commentsRepository').commentsCountForCard(id),
  onOpen: () => deps.get('uiRepository').set('card:openedId', id),
  onClose: () => deps.get('uiRepository').set('card:openedId', null),
  textForLabel: label => deps.get('settingsRepository').textForLabel(label),
});

export default connect(mapStateToProps)(Component);
