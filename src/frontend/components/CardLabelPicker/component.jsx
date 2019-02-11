import React from 'react';
import PropTypes from 'prop-types';
import FunctionLink from 'components/FunctionLink';
import 'components/CardLabelPicker/styles.scss';

export default class CardLabelPicker extends React.Component {
  static propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    textForLabel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  render() {
    const { textForLabel, colors, onChange, className } = this.props;
    return (
      <div className={`card-label-picker ${className}`}>
        <h1 className="header">Toggle a label for this card:</h1>
        <ul className="labels">
          { colors.map(color => (
            <FunctionLink
              component="li"
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              className="label"
            >
              {textForLabel(color)}
            </FunctionLink>
          ))}
        </ul>
      </div>
    );
  }
}
