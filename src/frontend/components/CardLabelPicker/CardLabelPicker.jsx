import React from 'react';
import SettingsRepository from 'lib/settings-repository.js';
import 'components/CardLabelPicker/card-label-picker.scss';

export default class CardLabelPicker extends React.Component {
  constructor(props) {
    super(props);
    this.labelPickedCallback = this.props.onLabelPicked;
    this.otherCssClasses = this.props.className || '';
    this.stateManager = this.props.stateManager;
    this.repo = new SettingsRepository(this.stateManager);
  }

  cssClasses() {
    return `card-label-picker ${this.otherCssClasses}`;
  }

  textForLabel(color) {
    return this.repo.getTextForLabel(color);
  }

  render() {
    const availableColors = this.repo.availableColors();
    return (
      <div className={this.cssClasses()}>
        <h1 className="title">Toggle a label for this card:</h1>
        <ul className="labels">
          { availableColors.map(color =>
            <li
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => { this.labelPickedCallback(color); }}
              className="label"
            >{this.textForLabel(color)}</li>
          )}
        </ul>
      </div>
    );
  }
}
