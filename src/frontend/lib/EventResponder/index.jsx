import React from 'react';
import PropTypes from 'prop-types';
import connect from 'lib/dependencyContext/connect';

class EventResponder extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  componentWillMount() {
    const { state } = this.props;
    state.addObserver(this);
  }

  componentWillUnmount() {
    const { state } = this.props;
    state.removeObserver(this);
  }

  onStateUpdate() {
    this.forceUpdate();
  }

  render() {
    const { children } = this.props;
    return React.cloneElement(children, {
      reactReloader: Math.random(),
    });
  }
}

const mapStateToProps = deps => ({
  state: deps.get('stateManager'),
});

export default connect(mapStateToProps)(EventResponder);
