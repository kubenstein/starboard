import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  isThemeColorDark: deps.get('settingsRepository').isThemeColorDark(),
  isSideMenuOpen: deps.get('uiRepository').get('sidemenu:open'),
  boardName: deps.get('settingsRepository').boardName(),
  onBoardNameChange: name => deps.get('settingsRepository').setBoardName(name),
  onSideMenuToggle: () => deps.get('uiRepository').toggle('sidemenu:open'),
});

export default connect(mapStateToProps)(Component);
