import React from 'react';
import PropTypes from 'prop-types';
import 'components/EditableInput/styles.scss';

export default class EditableInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    value: '',
    placeholder: '',
    type: '',
    onChange: (() => {}),
  }

  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      value,
      currentlyEditing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    const { currentlyEditing } = this.state;
    if (value && !currentlyEditing) {
      this.setState({ value });
    }
  }

  onEnterCheck = e => (e.key === 'Enter') && this.input.blur();

  onFocus = () => this.setState({ currentlyEditing: true });

  onBlur = () => {
    this.setState({ currentlyEditing: false });
    this.onFinalizedEditing();
  }

  onInputChange = e => this.setState({ value: e.target.value });

  onFinalizedEditing = () => {
    const { value } = this.input;
    const { onChange } = this.props;
    onChange(value);
  }

  cssClasses() {
    const { className } = this.props;
    const { currentlyEditing } = this.state;
    const editingCssClass = currentlyEditing ? 'editing' : '';
    return `editable-input ${className} ${editingCssClass}`;
  }

  renderTextarea(value) {
    const { placeholder } = this.props;
    return (
      <textarea
        className={this.cssClasses()}
        value={value}
        placeholder={placeholder}
        ref={(e) => { this.input = e; }}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onChange={this.onInputChange}
      />
    );
  }

  renderInput(value) {
    const { placeholder } = this.props;
    return (
      <input
        type="text"
        className={this.cssClasses()}
        data-value={value}
        value={value}
        placeholder={placeholder}
        ref={(e) => { this.input = e; }}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onKeyPress={this.onEnterCheck}
        onChange={this.onInputChange}
      />
    );
  }

  render() {
    const { value } = this.state;
    const { type } = this.props;
    return (type === 'textarea') ? this.renderTextarea(value) : this.renderInput(value);
  }
}
