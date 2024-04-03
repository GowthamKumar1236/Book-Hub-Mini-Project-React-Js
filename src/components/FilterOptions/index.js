import './index.css'

const FilterOptions = props => {
  const {isActive, filterBookDetails, getFilterBook} = props
  const {id, label, value} = filterBookDetails

  const selectCurrentStatus = isActive && 'selected-status'

  const onClickRenderStatus = () => {
    getFilterBook(id, value, label)
  }

  return (
    <li className="filter-nav-items">
      <button
        type="button"
        className={`item-button ${selectCurrentStatus}`}
        onClick={onClickRenderStatus}
      >
        {label}
      </button>
    </li>
  )
}

export default FilterOptions
