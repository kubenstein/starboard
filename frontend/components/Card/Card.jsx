import React from 'react';
import 'components/Card/card.scss';

export default class Card extends React.Component {
  render() {
    const data = this.props.data;
    return (
      <div className="card">
        <h1 className="title">{data.title}</h1>
      </div>
    );
  }
}
