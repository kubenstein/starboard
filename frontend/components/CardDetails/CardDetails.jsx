import React from 'react';
import 'components/CardDetails/card-details.scss';

export default class CardDetails extends React.Component {
  render() {
    const cardData = this.props.data;
    return (
      <div className="card-details">
        <h1 className="title">{cardData.title}</h1>
        <h4 className="sub-title">Description:</h4>
        <p className="desciption">{cardData.description}</p>
      </div>
    );
  }
}
