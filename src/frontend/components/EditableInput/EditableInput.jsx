import React from 'react';
import 'components/EditableInput/editable-input.scss';

export default class EditableInput extends React.Component {
  constructor(props) {
    super(props);
    this.value = this.props.value || '';
    this.placeholder = this.props.placeholder || '';
    this.type = this.props.type;
    this.otherCssClasses = this.props.className || '';
    this.changeCallback = this.props.onChange;
    this.keyPressCallback = this.props.onKeyPress || (() => {});
    this.state = {
      value: this.value,
      currentlyEdditing: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;
    if (value && !this.state.currentlyEdditing) {
      this.setState({ value: value });
    }
  }

  onEnterCheck(e) {
    if (e.key === 'Enter') {
      this.input.blur();
    }
  }

  onFocus() {
    this.setState({ currentlyEdditing: true });
  }

  onBlur() {
    this.setState({ currentlyEdditing: false });
    this.onFinalizedEditing();
  }

  onFinalizedEditing() {
    const value = this.input.value;
    this.changeCallback(value);
  }

  onInputChange(e) {
    const value = e.target.value;
    this.setState({ value: value });
  }

  cssClasses() {
    return `editable-input ${this.otherCssClasses}`;
  }

  textareaJSX(value) {
    return (
      <textarea
        className={this.cssClasses()}
        value={value}
        placeholder={this.placeholder}
        ref={(e) => { this.input = e; }}
        onBlur={() => { this.onBlur(); }}
        onFocus={() => { this.onFocus(); }}
        onChange={(e) => { this.onInputChange(e); }}
      />
    );
  }

  inputJSX(value) {
    return (
      <input
        type="text"
        className={this.cssClasses()}
        value={value}
        placeholder={this.placeholder}
        ref={(e) => { this.input = e; }}
        onBlur={() => { this.onBlur(); }}
        onFocus={() => { this.onFocus(); }}
        onKeyPress={(e) => { this.onEnterCheck(e); }}
        onChange={(e) => { this.onInputChange(e); }}
      />
    );
  }

  render() {
    const value = this.state.value;
    return (this.type === 'textarea') ?
      this.textareaJSX(value)
    :
      this.inputJSX(value);
  }
}
