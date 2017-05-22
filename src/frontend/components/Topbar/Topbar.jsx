import React from 'react';
import 'components/Topbar/topbar.scss';

export default class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
  }

  render() {
    return (
      <div className="topbar"></div>
    );
  }
}
