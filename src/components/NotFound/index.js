import './index.css'
import {Link} from 'react-router-dom'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dzxsnrerx/image/upload/v1711369494/ped0phkcnq01rgxrghvu.png"
      alt="not found"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="go-back-btn">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
