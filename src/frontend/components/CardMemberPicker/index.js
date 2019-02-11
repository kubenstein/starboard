import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { card }) => ({
  users: deps.get('usersRepository').all(),
  removeComment: () => deps.get('commentsRepository').removeComment(card.id),
  nickname: userId => deps.get('usersRepository').userNickname(userId),
  onChange: (user) => {
    const memberId = user.id;
    const memberIds = card.memberIds || [];
    const shouldBeSet = (memberIds.indexOf(memberId) === -1);
    deps.get('cardsRepository').updateMember(card.id, memberId, shouldBeSet);
  },
});

export default connect(mapStateToProps)(Component);
