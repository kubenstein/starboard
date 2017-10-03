import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import 'components/Login/styles.scss';

export default class Login extends React.Component {
  static get propTypes() {
    return {
      onLogIn: PropTypes.func.isRequired,
      displayError: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      displayError: false,
    };
  }

  submit(e) {
    e.preventDefault();
    const { onLogIn } = this.props;
    const { email, password } = serialize(this.formElement, { hash: true });
    if (email && password) {
      onLogIn(email, password);
    }
  }

  render() {
    const { displayError } = this.props;
    return (
      <div className="login">
        <form
          className="form"
          ref={(e) => { this.formElement = e; }}
          onSubmit={(e) => { this.submit(e); }}
        >
          <h1 className="title">Login:</h1>
          <input className="input" name="email" type="email" placeholder="Email..." />
          <input className="input" name="password" type="password" placeholder="password..." />
          <input className="btn btn-success" type="submit" value="log in" />
          { displayError &&
            <p className="error-msg">Unable to log in with given credentials.</p>
          }
        </form>
      </div>
    );
  }
}
