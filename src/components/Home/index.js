import {Component} from 'react'
import {Link} from 'react-router-dom'

import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'
import Header from '../Header'
import Footer from '../Footer'

const apiStatusConstants = {
  inital: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {booksList: [], apiStatus: apiStatusConstants.inital}

  componentDidMount() {
    this.getBooksDetails()
  }

  getBooksDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const booksUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const response = await fetch(booksUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.books.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      this.setState({
        booksList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSlider = () => {
    const {booksList} = this.state
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }
    return (
      <div className="slick-container">
        <Slider {...settings}>
          {booksList.map(book => {
            const {id, authorName, coverPic, title} = book
            return (
              <Link to={`/books/${id}`} className="slick-link" key={book.id}>
                <li className="slick-item">
                  <img className="cover-pic" src={coverPic} alt="title" />
                  <h1 className="title">{title}</h1>
                  <p className="author-name">{authorName}</p>
                </li>
              </Link>
            )
          })}
        </Slider>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  onClickTryAgain = () => {
    this.getBooksDetails()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dzxsnrerx/image/upload/v1711367020/samples/fxcrh8jyx3qvbvuowvq4.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-description">
        Something went wrong, Please try again.
      </p>
      <button
        className="try-button"
        type="button"
        onClick={this.onClickTryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderBooksView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSlider()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="home-container">
          <div className="responsive-containers">
            <h1 className="home-heading">Find Your Next Favorite Books?</h1>
            <p className="home-description">
              You are in the right place. Tell us what titles or genres you have
              enjoyed in the past, and we will give you surprisingly insightful
              recommendations.
            </p>
            <Link to="/shelf">
              <button type="button" className="find-mobile-button">
                Find Books
              </button>
            </Link>
          </div>
          <div className="books-card-container">
            <div className="heading-button-containers">
              <h1 className="rated-books-heading">Top Rated Books</h1>
              <Link to="/shelf" className="button-item">
                <button type="button" className="find-button">
                  Find Books
                </button>
              </Link>
            </div>
            {this.renderBooksView()}
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default Home
