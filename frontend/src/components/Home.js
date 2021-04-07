import React, { Fragment,useState, useEffect } from 'react'
import MetaData from './layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import {getProducts} from '../action/productActions'
import Product from './product/Product'
import Loader from './layout/Loader'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import Slider, { createSliderWithTooltip } from 'rc-slider'
import SliderCom from './layout/SliderCom';
import 'rc-slider/assets/index.css'
// =========================================================
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({match}) => {
    const [currentPage,setCurrentPage] = useState(1)
    const {isClick,clickData,isLogoClick} = useSelector(state => state.onClick)
    const [price,setPrice] = useState([1,10000])
    const [category,setCategory] = useState('')
    const [rating,setRating] = useState(0)
    const categories = [
        'Car',
        'Motor',
        'Laptop',
        'Phone',
        'Skincare',
        'Clothes',
        'Shoes',
    ]
    const alert = useAlert()
    const dispatch = useDispatch()
    const {loading,products,error,productCount,resPerPage,filteredProductsCount} = useSelector(state => state.products)
    let keyword = match.params.keyword
    useEffect(()=>{
        if(error){
            return alert.error(error)
        }
            dispatch(getProducts(keyword,currentPage,price,category,rating))
    },
    [dispatch,alert,error,keyword,currentPage,price,category,rating,isClick,isLogoClick])

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    let count = productCount;
    if(keyword){
        count = filteredProductsCount
    }
    return (
<Fragment>
            {loading ? <Loader/> : (
<>
<MetaData title={`HUNGNH`}/>
{
    !keyword ? (
        <>
        <div className="container container-fluid">
        <h1 id="products_heading">Newest Products</h1>
      </div>
      <SliderCom/>
      </>
    ) : <></>
}

<h1 id="products_heading">Latest Products</h1>
<section id="products" className="container mt-5">
<div className="row">

        { keyword ? (
            <>
                <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                        <Range
                            marks={{
                                1 : `$1`,
                                10000 : `$10000`
                            }}
                            min={1}
                            max={10000}
                            defaultValue={[1,10000]}
                            tipFormatter={value => `$${value}`}
                            tipProps={{
                                placement: "top",
                                visible:true
                            }}
                            value={price}
                            onChange={price => setPrice(price)}
                        />
                        <hr className="my-5"/>

                        <div className="mt-5">
                            <h4 className="mb-3">
                                Categories
                            </h4>
                            <ul className="pl-0">
                                {
                                    categories.map(category => (
                                        <li style={{cursor:'pointer',listStyle:'none'}} key = {category}
                                        onClick={()=>setCategory(category)}> 
                                        {category}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <hr className="my-3"/>

                        <div className="mt-5">
                            <h4 className="mb-3">
                                Ratings
                            </h4>
                            <ul className="pl-0">
                                {
                                    [5,4,3,2,1].map(star => (
                                        <li style={{cursor:'pointer',listStyle:'none'}} key = {star}
                                        onClick={()=>setRating(star)}> 
                                        <div className="rating-outer">
                                            <div className="rating-inner"
                                            style={{
                                                width: `${star * 20}%`
                                            }}
                                            
                                            >

                                            </div>
                                        </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-9">
                    <div className="row">
                        {
                             products && products.map((product,key) => (
                                <Product key={key}
                                product={product}
                                col={4}
                                />
                                ))
                        }
                    </div>
                </div>
            </>
        ) : (
            products && products.map((product,key) => (
                <Product key={key}
                product={product}
                col={3}
                />
                ))
        )}

</div>
</section>
            {resPerPage <= count &&(
<div className="d-flex justify-content-center mt-5">
    <Pagination 
        activePage={currentPage}
        itemsCountPerPage={resPerPage}
        totalItemsCount = {productCount}
        onChange = { setCurrentPageNo }
        nextPageText={'Next'}
        prevPageText={'Prev'}
        firstPageText={'First'}
        lastPageText={'Last'}
        itemClass = "page-item"
        linkClass = "page-link"
    />
</div>
            ) }

</>
)}
</Fragment>
    )
}

export default Home
