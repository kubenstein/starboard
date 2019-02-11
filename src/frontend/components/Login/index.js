import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = deps => ({
  loginError: deps.get('uiRepository').get('app:login:error'),
  rehydrateFromCookie: () => {
    const isLoggedIn = deps.get('userSessionService').isLoggedIn();
    if (isLoggedIn) {
      deps.get('uiRepository').set('app:login:error', false);
      deps.get('uiRepository').set('user:loggedIn', true);
    }
  },
  onLogIn: (email, password) => deps.get('userSessionService')
    .login(email, password)
    .then(() => {
      deps.get('uiRepository').set('app:login:error', false);
      deps.get('uiRepository').set('user:loggedIn', true);
    })
    .catch(() => {
      deps.get('uiRepository').set('app:login:error', true);
      deps.get('uiRepository').set('user:loggedIn', false);
    }),
});

export default connect(mapStateToProps)(Component);
