import React from 'react';
import PropTypes from 'prop-types';
import SettingsRepository from 'lib/repositories/settings-repository';
import 'components/CardLabelPicker/styles.scss';

export default class CardLabelPicker extends React.Component {
  static get propTypes() {
    return {
      stateManager: PropTypes.object.isRequired,
      onLabelPicked: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { stateManager } = this.props;
    this.repo = new SettingsRepository(stateManager);
  }

  textForLabel(color) {
    return this.repo.textForLabel(color);
  }

  render() {
    const { onLabelPicked, className = '' } = this.props;
    const availableColors = this.repo.availableColors();
    return (
      <div className={`card-label-picker ${className}`}>
        <h1 className="title">Toggle a label for this card:</h1>
        <ul className="labels">
          { availableColors.map(color =>
            <li
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => { onLabelPicked(color); }}
              className="label"
            >{this.textForLabel(color)}</li>
          )}
        </ul>
      </div>
    );
  }
}
