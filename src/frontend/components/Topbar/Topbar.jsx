import React from 'react';
import EdditableInput from 'components/EdditableInput/EdditableInput.jsx';
import SettingsRepository from 'lib/settings-repository.js';
import 'components/Topbar/topbar.scss';

export default class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.repo = new SettingsRepository(this.stateManager);
  }

  updateBoardName(name) {
    this.repo.setBoardName(name);
  }

  updatePageTitle(title) {
    document.title = title || 'Starboard';
  }

  render() {
    const boardName = this.repo.getBoardName();
    this.updatePageTitle(boardName);
    return (
      <div className="topbar">
        <EdditableInput
          className="boardName"
          value={boardName}
          onChange={(value) => { this.updateBoardName(value); }}
        />

        <div className="menu-zone">
          <label className="side-menu-trigger" htmlFor="side-menu-trigger-checkbox">☰</label>
          <input
            type="checkbox"
            className="side-menu-trigger-checkbox"
            id="side-menu-trigger-checkbox"
          />
          <div className="side-menu">
            <p>Menu</p>
          </div>
        </div>
      </div>
    );
  }
}
