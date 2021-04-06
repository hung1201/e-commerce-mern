import React, { Fragment,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, adminOrders, deleteOrder } from '../../action/orderActions'
import Sidebar from './Sidebar'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'
// import { DELETE_PRODUCT_RESET } from '../../constants/orderConstants'
// =======================================================
const OrderList = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading, error, orders} = useSelector(state => state.adminOrder)
    const { isDeleted, error: deleteError } = useSelector(state => state.updateOrder)
    useEffect(()=>{
        dispatch(adminOrders())
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(deleteError){
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success('Order deleted successfully');
            dispatch({
                type: DELETE_ORDER_RESET
            });
        }
    },[dispatch,error,alert,deleteError,isDeleted])
    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
    }
    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Number of items',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label:'Created At',
                    field:'createdAt',
                    sort: 'asc'
                },
                {
                    label: 'Action',
                    field: 'action',
                }
            ],
            rows:[]
        }
        orders.forEach(order => (
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount:`${order.totalPrice}`,
                createdAt: String(order.createdAt).substring(0,10),
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                ? <p style={{color:'green'}}>{order.orderStatus}</p> 
                : <p style={{color:'red'}}>{order.orderStatus}</p>
                ,
                action: 
                <Fragment>
                    <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
                            <i className="fa fa-eye"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2"
                    onClick={()=>deleteOrderHandler(order._id)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        ))
        return data
    }
    return (
        <Fragment>
            <MetaData title={'All orders'}/>
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <h1 className="my-5">All orders</h1>

                    {
                        loading ? <Loader/> : 
                        (
                            <MDBDataTable
                        data={setOrders()}
                        className="px-3"
                        bordered
                        striped
                        hover
                    />
                        )
                    }
                </Fragment>
            </div>
        </div>
        </Fragment>
    )
}

export default OrderList
