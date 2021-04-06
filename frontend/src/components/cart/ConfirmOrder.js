import React, { Fragment } from 'react'
import {Link} from 'react-router-dom'
import MetaData from '../layout/MetaData'
import { useSelector } from 'react-redux'
import CheckOutStep from './CheckOutStep'
// ===============================================================

const ConfirmOrder = ({history}) => {
    const { cartItems,shippingInfo } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.userR)

    // Calculate order price
    const itemsPrice =cartItems.reduce((acc,item)=> acc + item.price * item.quantity , 0)
    const shippingPrice = itemsPrice > 5000 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(1))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(1)

    const proceedToPayment =() => {
        const data ={
            itemsPrice: itemsPrice.toFixed(1),
            shippingPrice,
            taxPrice,
            totalPrice
        }
        sessionStorage.setItem('orderInfo',JSON.stringify(data))
        history.push('/payment')
    }
    return (
        <Fragment>
            <MetaData title={'Confirm order'}/>
            <CheckOutStep shipping confirmOrder/>

<div className="row d-flex justify-content-between">
<div className="col-12 col-lg-8 mt-5 order-confirm">

<h4 className="mb-3">Shipping Info</h4>
<p><b>Name:</b> {user.name}</p>
<p><b>Phone:</b> {shippingInfo.phoneNo}</p>
<p className="mb-4"><b>Address:</b> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.country}</p>

<hr />
<h4 className="mt-4">Your Cart Items:</h4>
{
    cartItems.map(item => (
        <Fragment key={item.product}>
            <hr />
<div className="cart-item my-1">
<div className="row">
<div className="col-4 col-lg-2">
<img src={item.image} alt="Laptop" height="45" width="65"/>
</div>
<div className="col-5 col-lg-6">
<Link to={`/products/${item.product}`}>{item.name}</Link>
</div>
<div className="col-4 col-lg-4 mt-4 mt-lg-0">
<p>{item.quantity} x ${item.price} = <b>${(item.quantity*item.price).toFixed(1)}</b></p>
</div>
</div>
</div>
        </Fragment>
    ))
}
</div>
<div className="col-12 col-lg-3 my-4">
<div id="order_summary">
<h4>Order Summary</h4>
<hr />
<p>Subtotal:  <span className="order-summary-values">${itemsPrice}</span></p>
<p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
<p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>
<hr />
<p>Total: <span className="order-summary-values">${totalPrice}</span></p>
<hr />
<button id="checkout_btn" className="btn btn-primary btn-block"
onClick={proceedToPayment}
>Proceed to Payment</button>
</div>
</div>
</div>
        </Fragment>
    )
}

export default ConfirmOrder
