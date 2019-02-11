import React from 'react';
import PropTypes from 'prop-types';
import FunctionLink from 'components/FunctionLink';
import 'components/CardLabelPicker/styles.scss';

export default class CardLabelPicker extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
    onLabelPicked: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  constructor(props) {
    super(props);
    const { deps } = this.props;
    this.repo = deps.get('settingsRepository');
  }

  renderLabelText(color) {
    return this.repo.textForLabel(color);
  }

  render() {
    const { onLabelPicked, className = '' } = this.props;
    const availableColors = this.repo.availableColors();
    return (
      <div className={`card-label-picker ${className}`}>
        <h1 className="header">Toggle a label for this card:</h1>
        <ul className="labels">
          { availableColors.map(color => (
            <FunctionLink
              component="li"
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onLabelPicked(color)}
              className="label"
            >
              {this.renderLabelText(color)}
            </FunctionLink>
          ))}
        </ul>
      </div>
    );
  }
}
