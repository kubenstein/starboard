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
    if (name) {
      this.repo.setBoardName(name);
    }
  }

  updatePageTitle(title) {
    if (title) {
      document.title = `${title} - Starboard`;
    }
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
      </div>
    );
  }
}
