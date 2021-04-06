import React, { Fragment,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, getOrderDetails } from '../../action/orderActions'
// ===============================================================
const OrderDetails = ({match}) => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading, error, order } = useSelector(state => state.orderDetails)
    const { user, shippingInfo, paymentInfo, orderStatus, orderItems } = order
    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`
    useEffect(()=>{
        dispatch(getOrderDetails(match.params.id))
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
    },[dispatch,error,match.params.id,alert])
    return (
        <Fragment>
            <MetaData title={'Order details'}/>
            {
                loading ? <Loader/> : (
                    <>
<div className="row d-flex justify-content-between">
<div className="col-12 col-lg-8 mt-5 order-details">

<h1 className="my-5">Order # {order._id} </h1>

<h4 className="mb-4">Shipping Info</h4>
<p><b>Name:</b> {user && user.name} </p>
<p><b>Phone:</b> ${order.itemsPrice}</p>
<p className="mb-4"><b>Address:</b> {shippingInfo && shippingDetails } </p>
<p><b>Amount:</b> ${order.totalPrice} </p>

<hr />

<h4 className="my-4">Payment</h4>
<p className={paymentInfo && String(paymentInfo.status.includes('succeeded')) ? "greenColor" : "redColor"}> {paymentInfo && String(paymentInfo.status.includes('succeeded')) ? "PAID" : "NOT PAID"}</p>


<h4 className="my-4">Order Status:</h4>
<p className={orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" :"redColor" }><b>{orderStatus}</b></p>


<h4 className="my-4">Order Items:</h4>

<hr />
<div className="cart-item my-1">
    {
        orderItems && orderItems.map(item => (
            <Fragment key={item._id}>
<div className="row my-5">
<div className="col-4 col-lg-2">
<img src={item.image} alt={item.image} height="45" width="65" />
</div>

<div className="col-5 col-lg-5">
<Link to={`/products/${item.product}`}>{item.name}</Link>
</div>


<div className="col-4 col-lg-2 mt-4 mt-lg-0">
<p>${item.price}</p>
</div>

<div className="col-4 col-lg-3 mt-4 mt-lg-0">
<p>{item.quantity} items</p>
</div>
</div>
</Fragment>
        ))
    }
</div>
<hr />
</div>
</div>
                    </>
                )
            }
        </Fragment>
    )
}

export default OrderDetails
