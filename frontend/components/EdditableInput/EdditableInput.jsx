import React from 'react';
import 'components/EdditableInput/edditable-input.scss';

export default class EdditableInput extends React.Component {
  constructor(props) {
    super(props);
    this.value = this.props.value;
    this.otherCssClasses = this.props.className;
    this.changeCallback = this.props.onChange;
  }

  onEditPressEnter(e) {
    if (e.key === 'Enter') {
      this.input.blur();
      this.onChange();
    }
  }

  onEditBlur() {
    this.onChange();
  }

  onChange() {
    const value = this.input.value;
    this.changeCallback(value);
  }

  cssClasses() {
    return `edditable-input ${this.otherCssClasses}`;
  }

  render() {
    return (
      <input
        type="text"
        className={this.cssClasses()}
        defaultValue={this.value}
        ref={(e) => { this.input = e; }}
        onBlur={() => { this.onEditBlur(); }}
        onKeyPress={(e) => { this.onEditPressEnter(e); }}
      />
    );
  }
}
