import React from 'react';
import 'components/ActivityItem/activity-item.scss';

export default class ActivityItem extends React.Component {
  constructor(props) {
    super(props);
    this.event = this.props.event;
  }

  render() {
    return (
      <div className="activitiy-item">
        {this.event.type}
      </div>
    );
  }
}
