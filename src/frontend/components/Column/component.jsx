import React from 'react';
import PropTypes from 'prop-types';
import AddCardForm from 'components/AddCardForm';
import Card from 'components/Card';
import EditableInput from 'components/EditableInput';
import DndSpaceRegistrator from 'lib/dndSupport/dnd-space-registrator';
import 'components/Column/styles.scss';

export default class Column extends React.Component {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    column: PropTypes.shape().isRequired,
    DNDManager: PropTypes.shape().isRequired,
    className: PropTypes.string,
    onNameUpdate: PropTypes.func.isRequired,
    onColumnRemove: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { DNDManager } = this.props;
    this.dndSpaceRegistrator = new DndSpaceRegistrator(DNDManager);
  }

  onColumnRemove = () => {
    const { onColumnRemove } = this.props;
    if (window.confirm('Do you want to remove this column?')) {
      onColumnRemove();
    }
  }

  render() {
    const {
      cards,
      className,
      onNameUpdate,
      column: { name, id },
    } = this.props;
    return (
      <div
        className={`column ${className}`}
        data-dnd-data-column-id={id}
      >
        <div className="clearfix">
          <EditableInput
            className="column-title column-DND-handler"
            value={name}
            onChange={onNameUpdate}
          />
          <button
            className="btn btn-remove btn-raw-icon"
            title="remove column"
            type="button"
            onClick={this.onColumnRemove}
          >
            ✕
          </button>
        </div>
        <div
          className="card-list"
          data-dnd-data-column-id={id}
          ref={ref => this.dndSpaceRegistrator.registerRefAsSpace(ref)}
        >
          { cards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </div>
        <AddCardForm columnId={id} />
      </div>
    );
  }
}
