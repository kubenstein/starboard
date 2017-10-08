import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import SideMenu from 'components/SideMenu';
import 'components/Topbar/styles.scss';

export default class Topbar extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.browserSettingsService = this.deps.get('browserSettingsService');
    this.settingsRepo = this.deps.get('settingsRepository');
    this.uiRepo = this.deps.get('uiRepository');
  }

  componentWillMount() {
    this.updatePageTitle(this.boardName());
  }

  updateBoardName(name) {
    this.settingsRepo.setBoardName(name);
    this.updatePageTitle(name);
  }

  boardName() {
    return this.settingsRepo.boardName();
  }

  updatePageTitle(title) {
    this.browserSettingsService.setTitle(title || 'Starboard');
  }

  darkLightThemeCss() {
    return this.settingsRepo.isThemeColorDark() ? 'dark-theme' : 'light-theme';
  }

  toggleSideMenu() {
    this.uiRepo.toggle('sidemenu:open');
  }

  render() {
    const boardName = this.settingsRepo.boardName();
    const isSideMenuOpen = this.uiRepo.get('sidemenu:open');
    return (
      <div className="topbar">
        <EditableInput
          className={`board-name ${this.darkLightThemeCss()}`}
          value={this.boardName()}
          onChange={(value) => { this.updateBoardName(value); }}
        />

        <div className="menu-zone">
          <a
            onClick={() => this.toggleSideMenu()}
            className={`side-menu-trigger ${this.darkLightThemeCss()}`}
          >☰</a>

          { isSideMenuOpen && (
            <div className="side-menu-wrapper">
              <SideMenu deps={this.deps} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
