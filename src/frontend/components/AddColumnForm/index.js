import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  isOpen: deps.get('uiRepository').get('columns:addForm:opened'),
  onOpen: () => deps.get('uiRepository').set('columns:addForm:opened', true),
  onClose: () => deps.get('uiRepository').set('columns:addForm:opened', false),
  addColumn: title => deps.get('columnsRepository').addColumn(title),
});

export default connect(mapStateToProps)(Component);
