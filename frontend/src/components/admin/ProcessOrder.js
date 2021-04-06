import React, { Fragment,useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, updateOrder,getOrderDetails } from '../../action/orderActions'
import Sidebar from './Sidebar'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'
// =======================================================
const ProcessOrder = ({match}) => {
    const [status,setStatus] = useState('')
    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, order } = useSelector(state => state.orderDetails)
    const { user, shippingInfo, paymentInfo, orderStatus, orderItems } = order
    const { isUpdated, error} = useSelector(state => state.updateOrder)
    const orderId = match.params.id
    
    useEffect(()=>{
        dispatch(getOrderDetails(orderId))
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(isUpdated){
            alert.success('Orders updated successfully');
            dispatch({
                type:UPDATE_ORDER_RESET
            });
        }
    },[dispatch,error,alert,isUpdated,orderId])
    
    const updateOrderHandler = (id) => {
        const formData = new FormData()
        formData.set('status',status)
        dispatch(updateOrder(id,formData))
    }
    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false
    return (
        <Fragment>
            <MetaData title={`Process order #${order._id}`}/>
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
            {
                loading ? <Loader/> : (
                    <>
<div className="d-flex col-md-8">
                    <div className="col-12 col-lg-10 order-details">

                        <h1 className="my-5">Order #{order._id}</h1>

                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {user && user.name} </p>
<p><b>Phone:</b> ${order.itemsPrice}</p>
<p className="mb-4"><b>Address:</b> {shippingInfo && shippingDetails } </p>
<p><b>Amount:</b> ${order.totalPrice} </p>

                        <hr />
                        <div className="col-12 d-flex justify-content-between ">
                            <div>
                                                        <h4 className="my-4">Payment</h4>
                        <p className={paymentInfo && String(paymentInfo.status.includes('succeeded')) ? "greenColor" : "redColor"}> {paymentInfo && String(paymentInfo.status.includes('succeeded')) ? "PAID" : "NOT PAID"}</p>
                            </div>
                            <div>
                                <h4 className="my-4">Stripe ID</h4>
                        <p className="greenColor" ><b>{paymentInfo && paymentInfo.id}</b></p>
                            </div>
                            <div>
                                <h4 className="my-4">Order Status:</h4>
                        <p className={orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" :"redColor" }><b>{orderStatus}</b></p>
                            </div>
                        </div>
                        <h4 className="my-4">Order Items:</h4>

                        <hr />
                        <div className="cart-item my-1">
                                    <div className="row my-5 justify-content-between">
                                    {
        orderItems && orderItems.map(item => (
            <div key={item._id} className="w-100 d-flex justify-content-between mt-4">
<div className="col-8 col-lg-2">
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
        ))
    }
                                    </div>
                        </div>
                        <hr />
                    </div>
					
					<div className="col-12 col-lg-4 mt-5">
                                    <h4 className="my-4">Status</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={status}
                                            onChange={e => setStatus(e.target.value)}
                                        >   <option value="0"hidden>Select</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>

                                    <button className="btn btn-primary btn-block"
                                    onClick={() => updateOrderHandler(order._id)}
                                    >
                                        Update Status
                                </button>
                                </div>
					
                </div>
                    </>
                )
            }
            </div>
            </Fragment>
    )
}

export default ProcessOrder
