import React from 'react';
import 'components/EdditableInput/edditable-input.scss';

export default class EdditableInput extends React.Component {
  constructor(props) {
    super(props);
    this.value = this.props.value;
    this.type = this.props.type;
    this.otherCssClasses = this.props.className;
    this.changeCallback = this.props.onChange;
    this.keyPressCallback = this.props.onKeyPress || (() => {});
  }

  onEnterCheck(e) {
    if (e.key === 'Enter') {
      this.input.blur();
      this.onChange();
    }
  }

  onBlur() {
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
      <div>
        { this.type === 'textarea' ?
          <textarea
            className={this.cssClasses()}
            defaultValue={this.value}
            ref={(e) => { this.input = e; }}
            onBlur={() => { this.onBlur(); }}
          />
        :
          <input
            type="text"
            className={this.cssClasses()}
            defaultValue={this.value}
            ref={(e) => { this.input = e; }}
            onBlur={() => { this.onBlur(); }}
            onKeyPress={(e) => { this.onEnterCheck(e); }}
          />
        }
      </div>
    );
  }
}
