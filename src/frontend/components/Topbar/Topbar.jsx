import React from 'react';
import BrowserSettings from 'lib/browser-settings.js';
import EditableInput from 'components/EditableInput/EditableInput.jsx';
import SideMenu from 'components/SideMenu/SideMenu.jsx';
import SettingsRepository from 'lib/settings-repository.js';
import 'components/Topbar/styles.scss';

export default class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.browserSettings = new BrowserSettings();
    this.repo = new SettingsRepository(this.stateManager);
  }

  updateBoardName(name) {
    this.repo.setBoardName(name);
  }

  updatePageTitle(title) {
    this.browserSettings.setTitle(title || 'Starboard');
  }

  darkLightThemeCss() {
    return this.repo.isThemeColorDark() ? 'dark-theme' : 'light-theme';
  }

  render() {
    const boardName = this.repo.boardName();
    this.updatePageTitle(boardName);
    return (
      <div className="topbar">
        <EditableInput
          className={`board-name ${this.darkLightThemeCss()}`}
          value={boardName}
          onChange={(value) => { this.updateBoardName(value); }}
        />

        <div className="menu-zone">
          <label
            className={`side-menu-trigger ${this.darkLightThemeCss()}`}
            htmlFor="side-menu-checkbox"
          >☰</label>
          <input
            type="checkbox"
            className="side-menu-checkbox"
            id="side-menu-checkbox"
          />
          <div className="side-menu-wrapper">
            <SideMenu stateManager={this.stateManager} />
          </div>
        </div>
      </div>
    );
  }
}
