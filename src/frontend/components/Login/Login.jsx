import React from 'react';
import serialize from 'form-serialize';
import 'components/Login/login.scss';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onLogIn = this.props.onLogIn;
  }

  submit(e) {
    e.preventDefault();
    const { username, email } = serialize(this.formElement, { hash: true });
    if (username && email) {
      this.onLogIn(username, email);
    }
  }

  render() {
    return (
      <div className="login">
        <form
          className="form"
          ref={(e) => { this.formElement = e; }}
          onSubmit={(e) => { this.submit(e); }}
        >
          <h1 className="title">Set your Identity:</h1>
          <input className="input" name="username" type="text" placeholder="User name..." />
          <input className="input" name="email" type="text" placeholder="Email..." />
          <input className="btn btn-login" type="submit" value="login" />
        </form>
      </div>
    );
  }
}
