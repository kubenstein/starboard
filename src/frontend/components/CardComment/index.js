import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { comment: { id, authorId } }) => ({
  nickname: deps.get('usersRepository').userNickname(authorId),
  removeComment: () => deps.get('commentsRepository').removeComment(id),
});

export default connect(mapStateToProps)(Component);
