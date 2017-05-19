import Cookies from 'js-cookie';

export function alreadyLoggedIn() {
  const data = loginData();
  return (data.username && data.email);
}

export function storeLoginData(username, email) {
  Cookies.set('username', username);
  Cookies.set('email', email);
}

export function loginData() {
  return {
    username: Cookies.set('username'),
    email: Cookies.set('email')
  };
}
