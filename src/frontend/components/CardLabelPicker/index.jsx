import React from 'react';
import PropTypes from 'prop-types';
import 'components/CardLabelPicker/styles.scss';

export default class CardLabelPicker extends React.Component {
  static get propTypes() {
    return {
      deps: PropTypes.object.isRequired,
      onLabelPicked: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    const { deps } = this.props;
    this.repo = deps.get('settingsRepository');
  }

  textForLabel(color) {
    return this.repo.textForLabel(color);
  }

  render() {
    const { onLabelPicked, className = '' } = this.props;
    const availableColors = this.repo.availableColors();
    return (
      <div className={`card-label-picker ${className}`}>
        <h1 className="header">Toggle a label for this card:</h1>
        <ul className="labels">
          { availableColors.map(color =>
            <li
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => { onLabelPicked(color); }}
              className="label"
            >{this.textForLabel(color)}</li>,
          )}
        </ul>
      </div>
    );
  }
}
