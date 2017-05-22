import React from 'react';
import 'components/EdditableInput/edditable-input.scss';

export default class EdditableInput extends React.Component {
  constructor(props) {
    super(props);
    this.value = this.props.value || '';
    this.state = { value: this.value };
    this.type = this.props.type;
    this.otherCssClasses = this.props.className || '';
    this.changeCallback = this.props.onChange;
    this.keyPressCallback = this.props.onKeyPress || (() => {});
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;
    if (value) {
      this.setState({ value: value });
    }
  }

  onEnterCheck(e) {
    if (e.key === 'Enter') {
      this.input.blur();
    }
  }

  onBlur() {
    this.onChange();
  }

  onChange() {
    const value = this.input.value;
    this.changeCallback(value);
  }

  onInputChange(e) {
    const value = e.target.value;
    this.setState({ value: value });
  }

  cssClasses() {
    return `edditable-input ${this.otherCssClasses}`;
  }

  render() {
    const value = this.state.value;
    return (
      <div>
        { this.type === 'textarea' ?
          <textarea
            className={this.cssClasses()}
            value={value}
            ref={(e) => { this.input = e; }}
            onBlur={() => { this.onBlur(); }}
            onChange={(e) => { this.onInputChange(e); }}
          />
        :
          <input
            type="text"
            className={this.cssClasses()}
            value={value}
            ref={(e) => { this.input = e; }}
            onBlur={() => { this.onBlur(); }}
            onKeyPress={(e) => { this.onEnterCheck(e); }}
            onChange={(e) => { this.onInputChange(e); }}
          />
        }
      </div>
    );
  }
}
