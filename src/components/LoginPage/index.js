import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showSubmitError: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onClickSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <div className="login-image-container">
          <img
            src="https://res.cloudinary.com/dzxsnrerx/image/upload/v1711364388/ignlbi3jtvm7kbjs7vb0.png"
            className="login-desktop"
            alt="website login"
          />
        </div>
        <div className="form-container">
          <img
            src="https://res.cloudinary.com/dzxsnrerx/image/upload/v1711336350/kczbqfqx58mxzwapdp82.png"
            className="website-login"
            alt="website login"
          />
          <img
            src="https://res.cloudinary.com/dzxsnrerx/image/upload/v1711336964/sq8k9noxhnnmfwchgffh.png"
            alt="login website logo"
            className="logo-image"
          />
          <form className="form" onSubmit={this.onClickSubmit}>
            <div className="input-content">
              <label className="label-names" htmlFor="username">
                Username*
              </label>
              <input
                type="text"
                className="input-user"
                id="username"
                placeholder="username"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="input-content">
              <label className="label-names" htmlFor="password">
                Password*
              </label>
              <input
                type="password"
                className="input-password"
                id="password"
                placeholder="password"
                onChange={this.onChangePassword}
              />
            </div>
            {showSubmitError && <p className="error-msg">{errorMsg}</p>}
            <div className="login-button-container">
              <button type="submit" className="login-btn">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
