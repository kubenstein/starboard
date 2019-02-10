import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import SideMenu from 'components/SideMenu';
import FunctionLink from 'components/FunctionLink';
import 'components/Topbar/styles.scss';

export default class Topbar extends React.Component {
  static propTypes = {
    boardName: PropTypes.string,
    isSideMenuOpen: PropTypes.bool,
    isThemeColorDark: PropTypes.bool,
    onBoardNameChange: PropTypes.func.isRequired,
    onSideMenuToggle: PropTypes.func.isRequired,
  }

  render() {
    const { isThemeColorDark, isSideMenuOpen, boardName, onBoardNameChange, onSideMenuToggle } = this.props;
    const themeCss = isThemeColorDark ? 'dark-theme' : 'light-theme';

    return (
      <div className="topbar">
        <EditableInput
          className={`board-name ${themeCss}`}
          value={boardName}
          onChange={onBoardNameChange}
        />

        <div className="menu-zone">
          <FunctionLink
            onClick={onSideMenuToggle}
            className={`side-menu-trigger ${themeCss}`}
          >
            ☰
          </FunctionLink>

          { isSideMenuOpen && (
            <div className="side-menu-wrapper">
              <SideMenu />
            </div>
          )}
        </div>
      </div>
    );
  }
}
