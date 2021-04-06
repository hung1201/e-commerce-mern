import React, { Fragment,useEffect, useState } from 'react'
import { MDBDataTable } from 'mdbreact'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, deleteProductReviews, getProductReviews } from '../../action/productActions'
import Sidebar from './Sidebar'
import { DELETE_REVIEW_RESET } from '../../constants/productConstants'
const ProductReviews = () => {
    const [productId, setProductId] = useState('')
    const alert = useAlert()
    const dispatch = useDispatch()
    const {  error, reviews} = useSelector(state => state.getReviews)
    const { isDeleted } = useSelector(state => state.adminProduct)
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success('Review deleted successfully');
            dispatch({
                type: DELETE_REVIEW_RESET
            });
        }
        if(productId !==''){
            dispatch(getProductReviews(productId))
        }
    },[dispatch,error,alert,productId,isDeleted])

    const deleteReviewHandler = (id) => {
        dispatch(deleteProductReviews(id,productId))
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(getProductReviews(productId))
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Action',
                    field: 'action',
                }
            ],
            rows:[]
        }
        reviews.forEach(review => (
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment:review.comment,
                user: review.name,
                action: 

                    <button className="btn btn-danger py-1 px-2 ml-2"
                    onClick={()=>deleteReviewHandler(review._id)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
            })
        ))
        return data
    }

    return (
<Fragment>
            <MetaData title={'All reviews'}/>
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                <div className="row justify-content-center mt-5">
			<div className="col-5">
                            <form onSubmit={submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="productId_field">Enter Product ID</label>
                                    <input
                                        type="text"
                                        id="productId_field"
                                        className="form-control"
                                        value={productId}
                                        onChange={(e)=>setProductId(e.target.value)}
                                    />
                                </div>

                                <button
                                    id="search_button"
                                    type="submit"
                                    className="btn btn-primary btn-block py-2"
                                >
                                    SEARCH
								</button>
                            </ form>
                        </div>
            
        </div>
                    {
                        reviews && reviews.length > 0 ? (
                            <MDBDataTable
                            data={setReviews()}
                            className="px-3"
                            bordered
                            striped
                            hover
                        />
                        ) : (
                            <p className="mt-5 text-center">No reviews</p>
                        )
                    }
                </Fragment>
            </div>
        </div>
        </Fragment>
    )
}

export default ProductReviews
