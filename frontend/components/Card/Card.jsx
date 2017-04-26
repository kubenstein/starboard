import React from 'react';
import CardDetails from 'components/CardDetails/CardDetails.jsx';
import 'components/Card/card.scss';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailsOpened: false,
    };
  }

  openDetails() {
    this.setState({ detailsOpened: true });
  }

  closeDetails(e) {
    if (e.target === this.dismissOverlayElement) {
      setTimeout(() => {
        this.setState({ detailsOpened: false });
      }, 0);
    }
  }

  render() {
    const cardData = this.props.data;
    const { detailsOpened } = this.state;
    return (
      <div className="card" onClick={() => { this.openDetails(); }}>
        <h1 className="title">{cardData.title}</h1>
        {detailsOpened ?
          <div
            className="card-details-full-screen-wrapper"
            onClick={(e) => { this.closeDetails(e); }}
            ref={(r) => { this.dismissOverlayElement = r; }}
          >
            <CardDetails data={cardData} />
          </div>
        : ''}
      </div>
    );
  }
}
