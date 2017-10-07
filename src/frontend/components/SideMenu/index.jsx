import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import ActivityItem from 'components/ActivityItem';
import AvatarEditor from 'components/AvatarEditor';
import 'components/SideMenu/styles.scss';

export default class SideMenu extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.settingsRepo = this.deps.get('settingsRepository');
    this.usersRepo = this.deps.get('usersRepository');
    this.activitiesRepo = this.deps.get('activitiesRepository');
    this.userLogoutUsecase = this.deps.get('userLogoutUsecase');
  }

  textForLabel(color) {
    return this.settingsRepo.textForLabel(color);
  }

  updateThemeColor(color) {
    this.settingsRepo.setThemeColor(color);
  }

  updateLabelText(color, value) {
    this.settingsRepo.setTextForLabel(color, value);
  }

  updateNickname(nickname) {
    this.usersRepo.setCurrentUserNickname(nickname);
  }

  logout() {
    this.userLogoutUsecase.logout();
  }

  labelCssClasses(color) {
    const labelId = color.replace('#', '');
    return `label-input-${labelId}`;
  }

  colorPickerCssClasses(color) {
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
            onClick={() => { this.logout(); }}
          />
          <br className="clearfix" />
          <AvatarEditor className="avatar-editor" stateManager={this.deps.get('stateManager')} />
          <EditableInput
            className="input-nickname"
            value={nickname}
            placeholder="Set Nickname..."
            onChange={(value) => { this.updateNickname(value); }}
          />
          <small className="user-id">{userId}</small>
        </div>

        <div className="section">
          <h3 className="section-title">Board Color:</h3>
          <ul className="color-picker">
            { availableColors.map(color =>
              <li
                key={color}
                style={{ backgroundColor: color }}
                className={this.colorPickerCssClasses(color)}
                onClick={() => { this.updateThemeColor(color); }}
              />,
            )}
          </ul>
        </div>

        <div className="section">
          <h3 className="section-title">Labels:</h3>
          <div className="label-editor">
            { availableColors.map(color =>
              <div key={color} className="label" style={{ backgroundColor: color }}>
                <EditableInput
                  className={this.labelCssClasses(color)}
                  value={this.textForLabel(color)}
                  onChange={(value) => { this.updateLabelText(color, value); }}
                />
              </div>,
            )}
          </div>
        </div>

        <div className="section activities-section">
          <h3 className="section-title">Latest Activities:</h3>
          <div className="activities">
            { activities.map(activity =>
              <ActivityItem
                key={activity.id}
                activity={activity}
                stateManager={this.deps.get('stateManager')}
              />,
            )}
          </div>
        </div>
      </div>
    );
  }
}
