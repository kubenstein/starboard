import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import Avatar from 'components/Avatar';
import AddCommentForm from 'components/AddCommentForm';
import CardComment from 'components/CardComment';
import CardLabelPicker from 'components/CardLabelPicker';
import CardMemberPicker from 'components/CardMemberPicker';
import FunctionLink from 'components/FunctionLink';
import 'components/CardDetails/styles.scss';

export default class CardDetails extends React.Component {
  static propTypes = {
    browserSettingsService: PropTypes.shape().isRequired,
    card: PropTypes.shape().isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    columnName: PropTypes.string,
    labelPickerOpened: PropTypes.bool,
    memberPickerOpened: PropTypes.bool,
    onLabelPickerToggle: PropTypes.func.isRequired,
    onMemberPickerToggle: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onTitleUpdate: PropTypes.func.isRequired,
    onDescriptionUpdate: PropTypes.func.isRequired,
    onCardRemove: PropTypes.func.isRequired,
    textForLabel: PropTypes.func.isRequired,

  }

  componentWillMount() {
    const { browserSettingsService } = this.props;
    browserSettingsService.registerKeyDownEvent(e => this.handleKeyDown(e));
  }

  componentWillUnmount() {
    const { browserSettingsService } = this.props;
    browserSettingsService.unregisterKeyDownEvent(e => this.handleKeyDown(e));
  }

  handleKeyDown = (event) => {
    const { onClose } = this.props;
    if (event.key === 'Escape') onClose();
  }

  onCardRemove = () => {
    const { onCardRemove, onClose } = this.props;
    if (window.confirm('Do you want to remove this card?')) {
      onCardRemove().then(() => onClose());
    }
  }

  render() {
    const {
      onTitleUpdate,
      onDescriptionUpdate,
      onClose,
      onLabelPickerToggle,
      onMemberPickerToggle,
      textForLabel,
      comments,
      columnName,
      labelPickerOpened,
      memberPickerOpened,
      card,
      card: { title, description, id, labels = [], memberIds = [] },
    } = this.props;
    return (
      <div className="card-details">
        <div className="title-wrapper">
          <button
            type="button"
            className="btn btn-raw-icon btn-close"
            onClick={onClose}
          >
            ✕
          </button>
          <EditableInput
            className="title"
            value={title}
            onChange={onTitleUpdate}
          />
        </div>
        <div className="two-cols-section">
          <div className="main-col">
            <h4 className="sub-title">{`In Column: ${columnName}`}</h4>
            <ul className="labels-section">
              { labels.map(label => (
                <li
                  key={label}
                  className="label"
                  style={{ backgroundColor: label }}
                >
                  {textForLabel(label)}
                </li>
              ))}
            </ul>
          </div>
          { memberIds.length > 0 && (
            <div className="additional-col members-section">
              <h4 className="sub-title">Assigned to:</h4>
              <div className="member-list">
                { memberIds.map(memberId => (
                  <Avatar
                    key={memberId}
                    className="member"
                    userId={memberId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <h4 className="sub-title">Description:</h4>
        <div className="two-cols-section">
          <EditableInput
            className="main-col description-input"
            type="textarea"
            value={description}
            ref={(e) => { this.descriptionInput = e; }}
            onChange={onDescriptionUpdate}
          />
          <div className="additional-col utils-section">
            <FunctionLink
              className="btn btn-danger btn-small btn-remove-card"
              onClick={this.onCardRemove}
            >
              Delete Card
            </FunctionLink>
            <FunctionLink
              className="btn btn-success btn-small btn-manage-labels"
              onClick={onLabelPickerToggle}
            >
              Manage Labels
            </FunctionLink>
            <FunctionLink
              className="btn btn-success btn-small btn-manage-members"
              onClick={onMemberPickerToggle}
            >
              Members
            </FunctionLink>

            { labelPickerOpened && (
              <div className="sub-modal">
                <FunctionLink
                  component="div"
                  className="off-trigger"
                  onClick={onLabelPickerToggle}
                />
                <div className="anchor">
                  <CardLabelPicker
                    className="sub-modal-content"
                    card={card}
                  />
                </div>
              </div>
            )}

            { memberPickerOpened && (
              <div className="sub-modal">
                <FunctionLink
                  component="div"
                  className="off-trigger"
                  onClick={onMemberPickerToggle}
                />
                <div className="anchor">
                  <CardMemberPicker
                    className="sub-modal-content"
                    card={card}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <h4 className="section-title clearfix">Comments:</h4>
        <AddCommentForm cardId={id} />
        { comments.map(comment => (
          <CardComment
            key={comment.id}
            comment={comment}
          />
        ))}
      </div>
    );
  }
}
