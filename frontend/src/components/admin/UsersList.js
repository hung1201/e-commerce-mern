import React, { Fragment,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, allUsers, deleteUser } from '../../action/userActions'
import Sidebar from './Sidebar'
import { DELETE_USER_RESET } from '../../constants/userConstants'

const UsersList = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading, error, users} = useSelector(state => state.allUsers)
    const { isDeleted, error: deleteError } = useSelector(state => state.adminUsers)
    useEffect(()=>{
        dispatch(allUsers())
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(deleteError){
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success('User deleted successfully');
            dispatch({
                type: DELETE_USER_RESET
            });
        }
    },[dispatch,error,alert,isDeleted,deleteError])

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id))
    }


    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
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
        users.forEach(user => (
            data.rows.push({
                id: user._id,
                name: user.name,
                email:user.email,
                createdAt: String(user.createAt).substring(0,10),
                role: user.role,
                action: 
                <Fragment>
                    <Link to={`/admin/users/${user._id}`} className="btn btn-primary">
                            <i className="fa fa-eye"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2"
                    onClick={()=>deleteUserHandler(user._id)}
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
            <MetaData title={'All users'}/>
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <h1 className="my-5">All users</h1>

                    {
                        loading ? <Loader/> : 
                        (
                            <MDBDataTable
                        data={setUsers()}
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

export default UsersList
