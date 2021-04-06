import React, { Fragment,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, myOrders } from '../../action/orderActions'
// ===============================================================

const ListOrders = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const {loading, error, orders} = useSelector(state => state.myOrders)
    
    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(myOrders())
    },[dispatch,error,alert])
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
                    label: 'Action',
                    field: 'action',
                    sort: 'asc'
                }
            ],
            rows:[]
        }
        orders.forEach(order => (
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')    ? <p style={{color:'green'}}>{order.orderStatus}</p> : <p style={{color:'red'}}>{order.orderStatus}</p> ,
                action: <Link to={`/order/${order._id}`} className="btn btn-primary">
                    <i className="fa fa-eye"></i>
                </Link>
            })
        ))
        return data
    }
    return (
        <Fragment>
            <MetaData title={'My orders'}/>
            <h1 className="my-5">My orders</h1>
            {
                loading ? <Loader/> : (
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
    )
}

export default ListOrders
