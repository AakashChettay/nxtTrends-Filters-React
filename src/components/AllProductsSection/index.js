import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const viewConstants = {
  initial: 'INITIAL',
  notFound: 'NOT_FOUND',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const categoryOptions = [
  {name: 'Clothing', categoryId: '1'},
  {name: 'Electronics', categoryId: '2'},
  {name: 'Appliances', categoryId: '3'},
  {name: 'Grocery', categoryId: '4'},
  {name: 'Toys', categoryId: '5'},
]

const sortbyOptions = [
  {optionId: 'PRICE_HIGH', displayText: 'Price (High-Low)'},
  {optionId: 'PRICE_LOW', displayText: 'Price (Low-High)'},
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    categoryId: '',
    ratingId: '',
    renderStatus: viewConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  categoryBasedApiCall = id => {
    this.setState({categoryId: id}, this.getProducts)
  }

  ratingBasedApiCall = id => {
    this.setState({ratingId: id}, this.getProducts)
  }

  searchBasedApiCall = searchVal => {
    this.setState({titleSearch: searchVal}, this.getProducts)
  }

  clearFilters = () => {
    this.setState(
      {titleSearch: '', ratingId: '', categoryId: ''},
      this.getProducts,
    )
  }

  getProducts = async () => {
    this.setState({isLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const {activeOptionId, categoryId, titleSearch, ratingId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryId}&title_search=${titleSearch}&rating=${ratingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      if (updatedData.length === 0) {
        this.setState({renderStatus: viewConstants.notFound})
      } else {
        this.setState({
          renderStatus: viewConstants.success,
          productsList: updatedData,
        })
      }
    } else {
      this.setState({renderStatus: viewConstants.failure})
    }
    this.setState({isLoading: false})
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="view-main-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        className="non-success-view-image"
        alt="products failure"
      />
      <h1 className="view-page-heading">Oops! Something Went Wrong</h1>
      <p className="view-page-para">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderNotFoundView = () => (
    <div className="view-main-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        className="non-success-view-image"
        alt="no products"
      />
      <h1 className="view-page-heading">No Products Found</h1>
      <p className="view-page-para">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {isLoading, renderStatus} = this.state
    return (
      <div className="all-products-section">
        <FiltersGroup
          ratingsList={ratingsList}
          categoryOptions={categoryOptions}
          searchBasedApiCall={this.searchBasedApiCall}
          categoryBasedApiCall={this.categoryBasedApiCall}
          ratingBasedApiCall={this.ratingBasedApiCall}
          clearFilters={this.clearFilters}
        />
        {isLoading
          ? this.renderLoader()
          : (() => {
              switch (renderStatus) {
                case viewConstants.notFound:
                  return this.renderNotFoundView()
                case viewConstants.failure:
                  return this.renderFailureView()
                case viewConstants.success:
                  return this.renderProductsList()
                default:
                  return null
              }
            })()}
      </div>
    )
  }
}

export default AllProductsSection
