import React from 'react';
import EdditableInput from 'components/EdditableInput/EdditableInput.jsx';
import SettingsRepository from 'lib/settings-repository.js';
import 'components/SideMenu/side-menu.scss';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.repo = new SettingsRepository(this.stateManager);
  }

  textForLabel(color) {
    return this.repo.getTextForLabel(color);
  }

  updateThemeColor(color) {
    this.repo.setThemeColor(color);
  }

  updateLabelText(color, value) {
    this.repo.setTextForLabel(color, value);
  }

  render() {
    const availableColors = this.repo.availableColors();
    return (
      <div className="side-menu">
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
          <div className="label-picker">
            { availableColors.map(color =>
              <div key={color} className="label" style={{ backgroundColor: color }}>
                <EdditableInput
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
