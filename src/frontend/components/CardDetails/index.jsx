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
    deps: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    card: PropTypes.object.isRequired, // TODO change to shape
  }

  constructor(props) {
    super(props);
    this.deps = this.props.deps;
    this.columnsRepo = this.deps.get('columnsRepository');
    this.commentsRepo = this.deps.get('commentsRepository');
    this.cardsRepo = this.deps.get('cardsRepository');
    this.usersRepo = this.deps.get('usersRepository');
    this.uiRepo = this.deps.get('uiRepository');
    this.settingsRepo = this.deps.get('settingsRepository');
    this.browserSettingsService = this.deps.get('browserSettingsService');
  }

  componentWillMount() {
    this.browserSettingsService.registerKeyDownEvent(() => this.handleKeyDown());
  }

  componentWillUnmount() {
    this.browserSettingsService.unregisterKeyDownEvent(() => this.handleKeyDown());
  }

  handleKeyDown = (event) => {
    const { onClose } = this.props;
    if (event.key === 'Escape') onClose();
  }

  textForLabel = color => this.settingsRepo.textForLabel(color);

  updateTitle = (newValue) => {
    const { card: { value: oldValue, id } } = this.props;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(id, { title: newValue });
    }
  }

  updateDescription = (newValue) => {
    const { card: { description: oldValue, id } } = this.props;
    if (newValue !== oldValue) {
      this.cardsRepo.updateCard(id, { description: newValue });
    }
  }

  updateLabels = (toggledLabel) => {
    const { card } = this.props;
    const labels = card.labels || [];
    const shouldBeSet = (labels.indexOf(toggledLabel) === -1);
    this.cardsRepo.updateLabel(card.id, toggledLabel, shouldBeSet);
  }

  updateMembers = (user) => {
    const { card } = this.props;
    const memberId = user.id;
    const memberIds = card.memberIds || [];
    const shouldBeSet = (memberIds.indexOf(memberId) === -1);
    this.cardsRepo.updateMember(card.id, memberId, shouldBeSet);
  }

  removeCard = (cardId) => {
    if (window.confirm('Do you want to remove this card?')) {
      this.cardsRepo.removeCard(cardId);
    }
  }

  render() {
    const {
      onClose,
      card,
      card: { title, description, id, columnId, labels = [], memberIds = [] },
    } = this.props;
    const comments = this.commentsRepo.commentsForCard(id);
    const columnName = this.columnsRepo.get(columnId).name;
    const labelPickerOpened = this.uiRepo.get('card:openLabelsPicker');
    const memberPickerOpened = this.uiRepo.get('card:openMemberPicker');
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
            onChange={this.updateTitle}
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
                  {this.textForLabel(label)}
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
                    deps={this.deps}
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
            onChange={this.updateDescription}
          />
          <div className="additional-col utils-section">
            <FunctionLink
              className="btn btn-danger btn-small btn-remove-card"
              onClick={() => this.removeCard(id)}
            >
              Delete Card
            </FunctionLink>
            <FunctionLink
              className="btn btn-success btn-small btn-manage-labels"
              onClick={() => this.uiRepo.toggle('card:openLabelsPicker')}
            >
              Manage Labels
            </FunctionLink>
            <FunctionLink
              className="btn btn-success btn-small btn-manage-members"
              onClick={() => this.uiRepo.toggle('card:openMemberPicker')}
            >
              Members
            </FunctionLink>

            { labelPickerOpened && (
              <div className="sub-modal">
                <FunctionLink
                  component="div"
                  className="off-trigger"
                  onClick={() => this.uiRepo.toggle('card:openLabelsPicker')}
                />
                <div className="anchor">
                  <CardLabelPicker
                    className="sub-modal-content"
                    card={card}
                    deps={this.deps}
                    onLabelPicked={this.updateLabels}
                  />
                </div>
              </div>
            )}

            { memberPickerOpened && (
              <div className="sub-modal">
                <FunctionLink
                  component="div"
                  className="off-trigger"
                  onClick={() => this.uiRepo.toggle('card:openMemberPicker')}
                />
                <div className="anchor">
                  <CardMemberPicker
                    className="sub-modal-content"
                    card={card}
                    deps={this.deps}
                    onMemberPicked={this.updateMembers}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <h4 className="section-title clearfix">Comments:</h4>
        <AddCommentForm cardId={id} deps={this.deps} />
        { comments.map(comment => (
          <CardComment
            key={comment.id}
            comment={comment}
            deps={this.deps}
          />
        ))}
      </div>
    );
  }
}
