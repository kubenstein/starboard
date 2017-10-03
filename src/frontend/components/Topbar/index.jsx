import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import SideMenu from 'components/SideMenu';
import SettingsRepository from 'lib/repositories/settings-repository';
import BrowserSettingsService from 'lib/services/browser-settings-service';
import 'components/Topbar/styles.scss';

export default class Topbar extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);
    const { stateManager } = this.props;
    this.browserSettingsService = new BrowserSettingsService();
    this.repo = new SettingsRepository(stateManager);
  }

  updateBoardName(name) {
    this.repo.setBoardName(name);
  }

  updatePageTitle(title) {
    this.browserSettingsService.setTitle(title || 'Starboard');
  }

  darkLightThemeCss() {
    return this.repo.isThemeColorDark() ? 'dark-theme' : 'light-theme';
  }

  render() {
    const { stateManager } = this.props;
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
            <SideMenu stateManager={stateManager} />
          </div>
        </div>
      </div>
    );
  }
}
