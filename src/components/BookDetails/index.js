import {Component} from 'react'
import './index.css'

import {BsFillStarFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'

const apiStatusConstants = {
  inital: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class BookDetails extends Component {
  state = {booksData: {}, apiStatus: apiStatusConstants.inital}

  componentDidMount() {
    this.getBooksData()
  }

  formattedData = book => ({
    id: book.id,
    authorName: book.author_name,
    coverPic: book.cover_pic,
    aboutBook: book.about_book,
    rating: book.rating,
    readStatus: book.read_status,
    title: book.title,
    aboutAuthor: book.about_author,
  })

  getBooksData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const bookId = id
    const apiUrl = `https://apis.ccbp.in/book-hub/books/${bookId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.formattedData(data.book_details)
      // console.log(updatedData)
      this.setState({
        booksData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderBooksDetails = () => {
    const {booksData} = this.state
    const {
      authorName,
      coverPic,
      aboutBook,
      rating,
      readStatus,
      title,
      aboutAuthor,
    } = booksData
    return (
      <div className="book-details-container">
        <div className="details-container">
          <img src={coverPic} className="cover-img" alt={title} />
          <div className="description-container">
            <h1 className="title-heading">{title}</h1>
            <p className="author-name-book">{authorName}</p>
            <div className="ratings-container">
              <p className="avg-rating">Avg Rating</p>
              <BsFillStarFill className="icon-star" />
              <p className="book-rating">{rating}</p>
            </div>
            <div className="render-status-container">
              <p className="status-heading">Status: </p>
              <p className="read-status">{readStatus}</p>
            </div>
          </div>
        </div>
        <hr className="horizontal-line" />
        <h1 className="about-author">About Author</h1>
        <p className="about-description">{aboutAuthor}</p>
        <h1 className="about-book">About Book</h1>
        <p className="book-description">{aboutBook}</p>
      </div>
    )
  }

  renderLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  onClickTryAgain = () => {
    this.getBooksData()
  }

  renderFailure = () => (
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

  renderBookDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        <div className="books-data-container">{this.renderBookDetails()}</div>
        <Footer />
      </div>
    )
  }
}

export default BookDetails
