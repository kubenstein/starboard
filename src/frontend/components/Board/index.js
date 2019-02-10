import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  deps,
  state: deps.get('stateManager'),
  columns: deps.get('columnsRepository').columnsSortedByPosition(),
  themeCSSStyles: deps.get('themeStyler').generateStyles(),
  updatePageTitle: () => {
    const boardName = deps.get('settingsRepository').boardName() || 'Starboard';
    deps.get('browserSettingsService').setTitle(boardName);
  },
  updatePageUrl: () => {
    const openedCardId = deps.get('uiRepository').get('card:openedId');
    deps.get('browserSettingsService').setUrlForCard(openedCardId);
  },
  rehydrateOpenedCardFromUrl: () => {
    const cardIdFromUrl = deps.get('browserSettingsService').urlCardId();
    deps.get('uiRepository').set('card:openedId', cardIdFromUrl);
  },
});

export default connect(mapStateToProps)(Component);
