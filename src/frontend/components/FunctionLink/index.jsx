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

  render() {
    const { children, component, ...props } = this.props;
    const { onClick } = this;

    return React.createElement(
      component, {
        ...props,
        onClick,
        role: 'button',
        tabIndex: '0',
      },
      children);
  }
}

export default FunctionLink;
