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
      currentlyEditing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;
    if (value && !this.state.currentlyEditing) {
      this.setState({ value: value });
    }
  }

  onEnterCheck(e) {
    if (e.key === 'Enter') {
      this.input.blur();
    }
  }

  onFocus() {
    this.setState({ currentlyEditing: true });
  }

  onBlur() {
    this.setState({ currentlyEditing: false });
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
    const editingCssClass = this.state.currentlyEditing ? 'editing' : '';
    return `editable-input ${className} ${editingCssClass}`;
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
        data-value={value}
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
