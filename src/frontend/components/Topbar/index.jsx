import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import SideMenu from 'components/SideMenu';
import FunctionLink from 'components/FunctionLink';
import 'components/Topbar/styles.scss';

export default class Topbar extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.settingsRepo = this.deps.get('settingsRepository');
    this.uiRepo = this.deps.get('uiRepository');
  }

  updateBoardName = name => this.settingsRepo.setBoardName(name);

  toggleSideMenu = () => this.uiRepo.toggle('sidemenu:open');

  themeCss = () => (this.settingsRepo.isThemeColorDark() ? 'dark-theme' : 'light-theme');

  render() {
    const isSideMenuOpen = this.uiRepo.get('sidemenu:open');
    const boardName = this.settingsRepo.boardName();
    return (
      <div className="topbar">
        <EditableInput
          className={`board-name ${this.themeCss()}`}
          value={boardName}
          onChange={this.updateBoardName}
        />

        <div className="menu-zone">
          <FunctionLink
            onClick={this.toggleSideMenu}
            className={`side-menu-trigger ${this.themeCss()}`}
          >
            ☰
          </FunctionLink>

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
