import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { card: { id, columnId, value } }) => ({
  browserSettingsService: deps.get('browserSettingsService'),
  columnName: deps.get('columnsRepository').get(columnId).name,
  comments: deps.get('commentsRepository').commentsForCard(id),
  labelPickerOpened: deps.get('uiRepository').get('card:openLabelsPicker'),
  memberPickerOpened: deps.get('uiRepository').get('card:openMemberPicker'),
  onLabelPickerToggle: () => deps.get('uiRepository').toggle('card:openLabelsPicker'),
  onMemberPickerToggle: () => deps.get('uiRepository').toggle('card:openMemberPicker'),
  onClose: () => deps.get('uiRepository').set('card:openedId', null),
  onTitleUpdate: title => (title !== value) && deps.get('cardsRepository').updateCard(id, { title }),
  onDescriptionUpdate: description => (description !== value) && deps.get('cardsRepository').updateCard(id, { description }),
  onCardRemove: () => deps.get('cardsRepository').removeCard(id),
  textForLabel: label => deps.get('settingsRepository').textForLabel(label),
});

export default connect(mapStateToProps)(Component);
