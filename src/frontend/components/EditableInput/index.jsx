import React from 'react';
import PropTypes from 'prop-types';
import 'components/EditableInput/styles.scss';

export default class EditableInput extends React.Component {
  static get propTypes() {
    return {
      value: PropTypes.string,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      onChange: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      value: '',
      placeholder: '',
      type: '',
      onChange: (() => {}),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      currentlyEdditing: false,
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
    const { value } = this.input;
    this.props.onChange(value);
  }

  onInputChange(e) {
    const { value } = e.target;
    this.setState({ value: value });
  }

  cssClasses() {
    const { className } = this.props;
    const edditingCssClass = this.state.currentlyEdditing ? 'edditing' : '';
    return `editable-input ${className} ${edditingCssClass}`;
  }

  textareaJSX(value) {
    const { placeholder } = this.props;
    return (
      <textarea
        className={this.cssClasses()}
        value={value}
        placeholder={placeholder}
        ref={(e) => { this.input = e; }}
        onBlur={() => { this.onBlur(); }}
        onFocus={() => { this.onFocus(); }}
        onChange={(e) => { this.onInputChange(e); }}
      />
    );
  }

  inputJSX(value) {
    const { placeholder } = this.props;
    return (
      <input
        type="text"
        className={this.cssClasses()}
        value={value}
        placeholder={placeholder}
        ref={(e) => { this.input = e; }}
        onBlur={() => { this.onBlur(); }}
        onFocus={() => { this.onFocus(); }}
        onKeyPress={(e) => { this.onEnterCheck(e); }}
        onChange={(e) => { this.onInputChange(e); }}
      />
    );
  }

  render() {
    const { value } = this.state;
    const { type } = this.props;
    return (type === 'textarea') ?
      this.textareaJSX(value)
    :
      this.inputJSX(value);
  }
}
