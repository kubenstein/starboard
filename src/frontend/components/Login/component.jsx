import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import 'components/Login/styles.scss';

export default class Login extends React.Component {
  static propTypes = {
    loginError: PropTypes.bool,
    rehydrateFromCookie: PropTypes.func.isRequired,
    onLogIn: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { rehydrateFromCookie } = this.props;
    rehydrateFromCookie();
  }

  submit = (e) => {
    e.preventDefault();
    const { onLogIn } = this.props;
    const { email, password } = serialize(this.formElement, { hash: true });
    if (email && password) {
      onLogIn(email, password);
    }
  }

  render() {
    const { loginError } = this.props;
    return (
      <div className="login">
        <form
          className="form"
          ref={(e) => { this.formElement = e; }}
          onSubmit={this.submit}
        >
          <h1 className="title">Login:</h1>
          <input className="input" name="email" type="email" placeholder="Email..." />
          <input className="input" name="password" type="password" placeholder="password..." />
          <input className="btn btn-success" type="submit" value="log in" />
          { loginError && (
            <p className="error-msg">Unable to log in with given credentials.</p>
          )}
        </form>
      </div>
    );
  }
}
