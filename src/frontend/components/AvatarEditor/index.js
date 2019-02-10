import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  avatarUrl: deps.get('usersRepository').currentUserAvatarUrl(),
  onAvatarRemove: () => deps.get('usersRepository').setCurrentUserAvatar(null),
  onAvatarUpload: fileBlob => deps.get('usersRepository').setCurrentUserAvatar({ blob: fileBlob }),
});

export default connect(mapStateToProps)(Component);
