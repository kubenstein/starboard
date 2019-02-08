import React, { Component } from 'react';
import PropTypes from 'prop-types';


class FunctionLink extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    component: PropTypes.node,
  }

  static defaultProps = {
    component: 'a',
    onClick: (() => {}),
  }

  onClick = (e) => {
    const { disabled, onClick } = this.props;

    if (!disabled) onClick(e);
  }

  onKeyPress = (e) => {
    // Check to see if space or enter were pressed
    if (e.key === ' ' || e.key === 'Enter') {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      this.onClick(e);
    }
  }

  render() {
    const { children, component, ...props } = this.props;
    const { onClick, onKeyPress } = this;

    return React.createElement(
      component, {
        ...props,
        onClick,
        onKeyPress,
        role: 'button',
        tabIndex: '0',
      },
      children);
  }
}

export default FunctionLink;
