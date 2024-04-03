import {Component} from 'react'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import {BsFillStarFill, BsSearch} from 'react-icons/bs'

import FilterOptions from '../FilterOptions'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstants = {
  inital: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Bookshelves extends Component {
  state = {
    booksList: [],
    searchInput: '',
    activeStatusId: bookshelvesList[0].id,
    bookshelfName: bookshelvesList[0].value,
    label: bookshelvesList[0].label,
    apiStatus: apiStatusConstants.inital,
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {searchInput, bookshelfName} = this.state
    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)
    const url = `https://apis.ccbp.in/book-hub/books?shelf=${bookshelfName}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)
      const updatedData = data.books.map(book => ({
        id: book.id,
        title: book.title,
        readStatus: book.read_status,
        rating: book.rating,
        authorName: book.author_name,
        coverPic: book.cover_pic,
      }))
      // console.log(updatedData)
      this.setState({
        booksList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getBooks()
    }
  }

  onClickSearch = () => {
    this.getBooks()
  }

  getFilterBook = (id, value, label) => {
    this.setState(
      {
        activeStatusId: id,
        bookshelfName: value,
        label,
      },
      this.getBooks,
    )
  }

  renderBooksShelvesList = () => {
    const {activeStatusId, searchInput} = this.state
    return (
      <div className='left-card-container'>
        <div className='mobile-search-box-container'>
          <input
            type='search'
            className='input-search'
            placeholder='Search'
            value={searchInput}
            onChange={this.onChangeSearch}
            onKeyDown={this.onEnterSearch}
          />
          <button
            type='button'
            className='search-button'
            testid='searchButton'
            onClick={this.onClickSearch}
          >
            <BsSearch className='search-icon' />
          </button>
        </div>
        <h1 className='navbar-heading'>BookShelves</h1>
        <ul className='books-options'>
          {bookshelvesList.map(eachOption => (
            <FilterOptions
              isActive={eachOption.id === activeStatusId}
              filterBookDetails={eachOption}
              key={eachOption.id}
              getFilterBook={this.getFilterBook}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderSearchResults = () => {
    const {searchInput} = this.state
    return (
      <div className='desktop-search-box-container'>
        <input
          type='search'
          className='input-search'
          placeholder='Search'
          value={searchInput}
          onChange={this.onChangeSearch}
          onKeyDown={this.onEnterSearch}
        />
        <button
          type='button'
          className='search-button'
          testid='searchButton'
          onClick={this.onClickSearch}
        >
          <BsSearch className='search-icon' />
        </button>
      </div>
    )
  }

  renderNoBooksPage = () => {
    const {searchInput} = this.state
    return (
      <div className='no-books-container'>
        <img
          src='https://res.cloudinary.com/dzxsnrerx/image/upload/v1711384437/cpyw3i8nybyzzpepilba.png'
          alt='no books'
          className='no-books-image'
        />
        <p className='books-description'>
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderBooksList = () => {
    const {booksList} = this.state
    const noBooksList = booksList.length === 0
    return (
      <>
        <ul className='books-list-container'>
          {noBooksList && this.renderNoBooksPage()}
          {booksList.map(eachBook => {
            const {id, title, readStatus, rating, authorName, coverPic} =
              eachBook
            return (
              <Link
                to={`/books/${id}`}
                className='books-alignment'
                key={eachBook.id}
              >
                <li className='books-list-item'>
                  <img src={coverPic} alt={title} className='cover-pic' />
                  <div className='books-information-container'>
                    <h1 className='title'>{title}</h1>
                    <p className='author-name'>{authorName}</p>
                    <div className='rating-container'>
                      <p className='rating-heading'>Avg Rating</p>
                      <BsFillStarFill className='star-icon' />
                      <p className='rating'>{rating}</p>
                    </div>
                    <div className='status-container'>
                      <p className='book-status-heading'>Status: </p>
                      <p className='book-read-status'>{readStatus}</p>
                    </div>
                  </div>
                </li>
              </Link>
            )
          })}
        </ul>
      </>
    )
  }

  renderBooksShelvesDisplaySectionView = () => {
    const {label} = this.state
    return (
      <div className='books-display-container'>
        <div className='search-heading-container'>
          <h1 className='custom-book-heading'>{label} Books</h1>
          {this.renderSearchResults()}
        </div>
        {this.renderBooksList()}
      </div>
    )
  }

  renderBooksShelves = () => (
    <div className='bookshelves'>
      {this.renderBooksShelvesList()}
      {this.renderBooksShelvesDisplaySectionView()}
    </div>
  )

  renderLoading = () => (
    <div className='loader-container' testid='loader'>
      <Loader type='TailSpin' color='#0284C7' height={50} width={50} />
    </div>
  )

  onClickTryAgain = () => {
    this.getBooks()
  }

  renderFailure = () => (
    <div className='failure-container'>
      <img
        src='https://res.cloudinary.com/dzxsnrerx/image/upload/v1711367020/samples/fxcrh8jyx3qvbvuowvq4.png'
        alt='failure view'
        className='failure-img'
      />
      <p className='failure-description'>
        Something went wrong, Please try again.
      </p>
      <button
        className='try-button'
        type='button'
        onClick={this.onClickTryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderBookShelvesView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksShelves()
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
      <>
        <Header />
        <div className='bookshelves-container'>
          {this.renderBookShelvesView()}
          <Footer />
        </div>
      </>
    )
  }
}

export default Bookshelves
