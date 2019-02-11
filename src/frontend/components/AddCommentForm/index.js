import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { cardId }) => ({
  addComment: ({ attachment = null, content = null }) => {
    const authorId = deps.get('stateManager').getUserId();
    return deps.get('commentsRepository').addComment(cardId, { attachment, content, authorId });
  },

  isOpen: deps.get('uiRepository').get('columns:addForm:opened'),
  onOpen: () => deps.get('uiRepository').set('columns:addForm:opened', true),
  onClose: () => deps.get('uiRepository').set('columns:addForm:opened', false),
  addColumn: title => deps.get('columnsRepository').addColumn(title),
});

export default connect(mapStateToProps)(Component);
