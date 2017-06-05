import React from 'react';
import EditableInput from 'components/EditableInput/EditableInput.jsx';
import SettingsRepository from 'lib/settings-repository.js';
import UsersRepository from 'lib/users-repository.js';
import UserLogoutUsecase from 'lib/user-logout-usecase.js';
import 'components/SideMenu/side-menu.scss';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.settingsRepo = new SettingsRepository(this.stateManager);
    this.usersRepo = new UsersRepository(this.stateManager);
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
    new UserLogoutUsecase().logout();
  }

  render() {
    const availableColors = this.settingsRepo.availableColors();
    const userId = this.usersRepo.currentUserId();
    const nickname = this.usersRepo.currentUserNickname();
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
                onClick={() => { this.updateThemeColor(color); }}
                className="color"
              />
            )}
          </ul>
        </div>

        <div className="section">
          <h3 className="section-title">Labels:</h3>
          <div className="label-editor">
            { availableColors.map(color =>
              <div key={color} className="label" style={{ backgroundColor: color }}>
                <EditableInput
                  value={this.textForLabel(color)}
                  onChange={(value) => { this.updateLabelText(color, value); }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
