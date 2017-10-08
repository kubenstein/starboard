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
    this.repo = this.deps.get('settingsRepository');
  }

  componentWillMount() {
    this.updatePageTitle(this.boardName());
  }

  updateBoardName(name) {
    this.repo.setBoardName(name);
    this.updatePageTitle(name);
  }

  boardName() {
    return this.repo.boardName();
  }

  updatePageTitle(title) {
    this.browserSettingsService.setTitle(title || 'Starboard');
  }

  darkLightThemeCss() {
    return this.repo.isThemeColorDark() ? 'dark-theme' : 'light-theme';
  }

  render() {
    return (
      <div className="topbar">
        <EditableInput
          className={`board-name ${this.darkLightThemeCss()}`}
          value={this.boardName()}
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
            <SideMenu deps={this.deps} />
          </div>
        </div>
      </div>
    );
  }
}
