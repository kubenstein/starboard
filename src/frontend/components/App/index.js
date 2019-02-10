import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  isLoggedIn: deps.get('uiRepository').get('user:loggedIn'),
});

export default connect(mapStateToProps)(Component);
