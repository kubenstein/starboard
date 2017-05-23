import React from 'react';
import SettingsRepository from 'lib/settings-repository.js';
import 'components/SideMenu/side-menu.scss';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.repo = new SettingsRepository(this.stateManager);

    this.availableColors = [
      '#00e6ff', '#3CB500', '#FAD900', '#FF9F19', '#EB4646', '#A632DB', '#0079BF'
    ];
  }

  updateThemeColor(color) {
    this.repo.setThemeColor(color);
  }

  render() {
    return (
      <div className="side-menu">
        <h3 className="section-title">Board Color:</h3>
        <ul className="color-picker">
          { this.availableColors.map(color =>
            <li
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => { this.updateThemeColor(color); }}
              className="color"
            />
          )}
        </ul>
      </div>
    );
  }
}
