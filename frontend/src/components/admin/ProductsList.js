import React, { Fragment,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, deleteProduct, getAdminProducts } from '../../action/productActions'
import Sidebar from './Sidebar'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'
// =======================================================
const ProductsList = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const {loading, error, products} = useSelector(state => state.products)
    const { error: deleteError, isDeleted} = useSelector(state => state.adminProduct)
    useEffect(()=>{
        dispatch(getAdminProducts())
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(deleteError){
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success('Product deleted successfully');
            dispatch({
                type: DELETE_PRODUCT_RESET
            });
        }
    },[dispatch,error,alert,isDeleted,deleteError])
    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }
    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc'
                },
                {
                    label:'Created At',
                    field:'createAt',
                    sort: 'asc'
                },
                {
                    label: 'Action',
                    field: 'action',
                }
            ],
            rows:[]
        }
        products.forEach(product => (
            data.rows.push({
                id: product._id,
                name: product.name,
                price:product.price,
                stock: product.stock,
                createAt: String(product.createAt).substring(0,10),
                action: 
                <Fragment>
                    <Link to={`/admin/products/${product._id}`} className="btn btn-primary py-1 px-2">
                    <i className="fa fa-pencil"></i>
                </Link>
                <button className="btn btn-danger py-1 px-2 ml-2"
                onClick={()=>deleteProductHandler(product._id)}
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
            <MetaData title={'All products'}/>
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <h1 className="my-5">All products</h1>

                    {
                        loading ? <Loader/> : 
                        (
                            <MDBDataTable
                        data={setProducts()}
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

export default ProductsList
