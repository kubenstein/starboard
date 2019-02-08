import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import ActivityItem from 'components/ActivityItem';
import AvatarEditor from 'components/AvatarEditor';
import FunctionLink from 'components/FunctionLink';
import 'components/SideMenu/styles.scss';

export default class SideMenu extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.settingsRepo = this.deps.get('settingsRepository');
    this.usersRepo = this.deps.get('usersRepository');
    this.activitiesRepo = this.deps.get('activitiesRepository');
    this.userSessionService = this.deps.get('userSessionService');
    this.browserSettingsService = this.deps.get('browserSettingsService');
  }

  textForLabel = color => this.settingsRepo.textForLabel(color);

  updateThemeColor = color => this.settingsRepo.setThemeColor(color);

  updateLabelText = (color, value) => this.settingsRepo.setTextForLabel(color, value);

  updateNickname = nickname => this.usersRepo.setCurrentUserNickname(nickname);

  logout = () => {
    this.userSessionService.logout();
    this.browserSettingsService.reloadPage();
  }

  labelCssClasses = (color) => {
    const labelId = color.replace('#', '');
    return `label-input-${labelId}`;
  }

  colorPickerCssClasses = (color) => {
    const pickerId = color.replace('#', '');
    return `color theme-color-picker-input-${pickerId}`;
  }

  render() {
    const availableColors = this.settingsRepo.availableColors();
    const userId = this.usersRepo.currentUserId();
    const nickname = this.usersRepo.currentUserNickname();
    const activities = this.activitiesRepo.latestEvents(10);
    return (
      <div className="side-menu">
        <div className="section user-section">
          <h3 className="section-title">User:</h3>
          <input
            className="btn-link btn-small btn-logout"
            type="button"
            value="log out"
            onClick={this.logout}
          />
          <br className="clearfix" />
          <AvatarEditor className="avatar-editor" deps={this.deps} />
          <EditableInput
            className="input-nickname"
            value={nickname}
            placeholder="Set Nickname..."
            onChange={this.updateNickname}
          />
          <small className="user-id">{userId}</small>
        </div>

        <div className="section">
          <h3 className="section-title">Board Color:</h3>
          <ul className="color-picker">
            { availableColors.map(color => (
              <FunctionLink
                component="li"
                key={color}
                style={{ backgroundColor: color }}
                className={this.colorPickerCssClasses(color)}
                onClick={() => this.updateThemeColor(color)}
              />
            ))}
          </ul>
        </div>

        <div className="section">
          <h3 className="section-title">Labels:</h3>
          <div className="label-editor">
            { availableColors.map(color => (
              <div key={color} className="label" style={{ backgroundColor: color }}>
                <EditableInput
                  className={this.labelCssClasses(color)}
                  value={this.textForLabel(color)}
                  onChange={value => this.updateLabelText(color, value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="section activities-section">
          <h3 className="section-title">Latest Activities:</h3>
          <div className="activities">
            { activities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                deps={this.deps}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
