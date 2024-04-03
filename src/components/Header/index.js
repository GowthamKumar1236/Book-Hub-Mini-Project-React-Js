import './index.css'

import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import {RiCloseCircleFill} from 'react-icons/ri'
import Cookies from 'js-cookie'

class Header extends Component {
  state = {toggleButton: false}

  onClickMenu = () => {
    this.setState(prevState => ({
      toggleButton: !prevState.toggleButton,
    }))
  }

  onClickClose = () => {
    this.setState(prevState => ({
      toggleButton: !prevState.toggleButton,
    }))
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    const {toggleButton} = this.state
    return (
      <nav className='navbar-container'>
        <div className='header-container'>
          <Link to='/'>
            <img
              src='https://res.cloudinary.com/dzxsnrerx/image/upload/v1711336964/sq8k9noxhnnmfwchgffh.png'
              className='website-logo'
              alt='website logo'
            />
          </Link>
          <ul className='desktop-items-container'>
            <li className='text'>
              <Link to='/' className='nav-item-link'>
                Home
              </Link>
            </li>
            <li className='text'>
              <Link to='/shelf' className='nav-item-link'>
                Bookshelves
              </Link>
            </li>
            <li>
              <Link to='/login' className='nav-item-link'>
                <button
                  className='logout-btn'
                  type='button'
                  onClick={this.onClickLogout}
                >
                  Logout
                </button>
              </Link>
            </li>
          </ul>
          <button
            type='button'
            className='menu-icon'
            onClick={this.onClickMenu}
          >
            <GiHamburgerMenu size={20} />
          </button>
        </div>
        {toggleButton && (
          <>
            <ul className='mobile-items-container'>
              <li className='text'>
                <Link to='/' className='nav-item-link'>
                  Home
                </Link>
              </li>
              <li className='text'>
                <Link to='/shelf' className='nav-item-link'>
                  Bookshelves
                </Link>
              </li>
              <li>
                <Link to='/login' className='nav-item-link'>
                  <button
                    className='logout-btn'
                    type='button'
                    onClick={this.onClickLogout}
                  >
                    Logout
                  </button>
                </Link>
              </li>
              <button
                type='button'
                className='close-icon'
                onClick={this.onClickClose}
              >
                <RiCloseCircleFill size={20} />
              </button>
            </ul>
          </>
        )}
      </nav>
    )
  }
}

export default withRouter(Header)
