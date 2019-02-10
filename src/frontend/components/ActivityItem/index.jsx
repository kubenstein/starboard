import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  userNickname: userId => deps.get('usersRepository').userNickname(userId),
  isCardExists: cardId => deps.get('cardsRepository').cardExists(cardId),
  onCardOpen: cardId => deps.get('uiRepository').set('card:openedId', cardId),
  textForLabel: label => deps.get('settingsRepository').textForLabel(label, true),
});

export default connect(mapStateToProps)(Component);
