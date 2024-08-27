import './index.css'
import {IoIosSearch} from 'react-icons/io'

const FiltersGroup = props => {
  const {
    ratingsList,
    categoryOptions,
    categoryBasedApiCall,
    ratingBasedApiCall,
    searchBasedApiCall,
    clearFilters,
  } = props

  const categorySelected = event => {
    const selectedCategoryId = event.currentTarget.id
    categoryBasedApiCall(selectedCategoryId)
  }

  const ratingSelected = event => {
    const selectedRatingId = event.currentTarget.id
    ratingBasedApiCall(selectedRatingId)
  }

  const handleSearch = event => {
    if (event.key === 'Enter') {
      const searchValue = event.target.value
      searchBasedApiCall(searchValue)
    }
  }

  const clearFiltersCalled = () => {
    clearFilters()
    document.getElementById('searchInputElement').value = ''
  }

  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          id="searchInputElement"
          onKeyDown={handleSearch}
          type="search"
          placeholder="Search"
          className="search-style"
        />
        <IoIosSearch className="search-icon" />
      </div>
      <h1 className="filter-group-heading">Category</h1>
      <ul className="category-list-style">
        {categoryOptions.map(category => (
          <p
            className="category-list-item-style category-list-margin-style"
            key={category.categoryId}
            id={category.categoryId}
            onClick={categorySelected}
          >
            {category.name}
          </p>
        ))}
      </ul>
      <h1 className="filter-group-heading">Rating</h1>
      <ul className="category-list-style">
        {ratingsList.map(rating => (
          <li
            className="category-list-item-style"
            key={rating.ratingId}
            id={rating.ratingId}
            onClick={ratingSelected}
          >
            <img
              src={rating.imageUrl}
              className="rating-stars-image"
              alt={`rating ${rating.ratingId}`}
            />
            <p className="up-style">& up</p>
          </li>
        ))}
      </ul>
      <button
        onClick={clearFiltersCalled}
        type="button"
        className="clear-filters-btn"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
