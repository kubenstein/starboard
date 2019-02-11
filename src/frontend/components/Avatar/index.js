import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { userId }) => ({
  avatarUrl: deps.get('usersRepository').userAvatarUrl(userId),
});

export default connect(mapStateToProps)(Component);
