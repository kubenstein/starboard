import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  availableColors: deps.get('settingsRepository').availableColors(),
  userId: deps.get('usersRepository').currentUserId(),
  nickname: deps.get('usersRepository').currentUserNickname(),
  activities: deps.get('activitiesRepository').latestEvents(10),
  textForLabel: color => deps.get('settingsRepository').textForLabel(color),
  onThemeColorChange: color => deps.get('settingsRepository').setThemeColor(color),
  onLabelTextChange: (color, value) => deps.get('settingsRepository').setTextForLabel(color, value),
  onNicknameChange: nickname => deps.get('usersRepository').setCurrentUserNickname(nickname),
  onLogout: () => {
    deps.get('userSessionService').logout();
    deps.get('browserSettingsService').reloadPage();
  },
});

export default connect(mapStateToProps)(Component);
