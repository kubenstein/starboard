import React from 'react';
import SettingsRepository from 'lib/settings-repository';
import 'components/CardLabelPicker/styles.scss';

export default class CardLabelPicker extends React.Component {
  constructor(props) {
    super(props);
    this.labelPickedCallback = this.props.onLabelPicked;
    this.otherCssClasses = this.props.className || '';
    this.stateManager = this.props.stateManager;
    this.repo = new SettingsRepository(this.stateManager);
  }

  textForLabel(color) {
    return this.repo.textForLabel(color);
  }

  render() {
    const availableColors = this.repo.availableColors();
    return (
      <div className={`card-label-picker ${this.otherCssClasses}`}>
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
