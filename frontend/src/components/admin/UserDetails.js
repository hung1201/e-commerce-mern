import React, { Fragment,useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, updateUser,getUserDetails } from '../../action/userActions'
import Sidebar from './Sidebar'
import { UPDATE_USER_RESET, USER_DETAILS_RESET } from '../../constants/userConstants'
import { set } from 'mongoose'
const UserDetails = ({match,history}) => {
    const [name,setName]= useState('')
    const [email,setEmail] = useState('')
    const [role,setRole]=useState('')
    const alert = useAlert()
    const dispatch = useDispatch()
    const { user, error } = useSelector(state => state.userDetails)
    const { error: updateError, isUpdated} = useSelector(state => state.adminUsers)


    const userId = match.params.id
    useEffect(()=>{
        if(user && user._id !== userId){
            dispatch(getUserDetails(userId))
        }
        else {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(updateError){
            alert.error(updateError)
            dispatch(clearErrors())
        }
        if(isUpdated){
            history.push('/admin/users');
            alert.success('User updated successfully');
            dispatch({
                type:UPDATE_USER_RESET
            });
            dispatch({
                type:USER_DETAILS_RESET
            })
        }
        
    },[dispatch,error,alert,history,isUpdated,updateError,userId,user])
    const updateUserHandler = (id) => {
        const formData = new FormData()
        formData.set('name',name)
        formData.set('email',email)
        formData.set('role',role)
        dispatch(updateUser(id,formData))
    }
    return (
        <Fragment>
            <MetaData title={'User details'}/>
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
                    <>
<div className="d-flex col-md-8">
                    <div className="col-12 col-lg-10">
                    <div className="col-12 col-md-3">
<figure className='avatar avatar-profile'>
<img className="rounded-circle img-fluid"
            src={user.avatar && user.avatar.url}
            alt='user avatar' />
</figure>
</div>
                        <h1 className="my-5">User #{user._id}</h1>

                        <h4 className="mb-4">User Info</h4>
<div className="form-group">
<label htmlFor="email_field">Name</label>
<input 
type="name" 
id="name_field" 
className="form-control"
name='name'
value={name}
onChange={(e)=>setName(e.target.value)}
/>
</div>

<div className="form-group">
<label htmlFor="email_field">Email</label>
<input
type="email"
id="email_field"
className="form-control"
name='email'
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>
</div>
<div className="col-12 col-lg-4 mt-5">
                                    <h4 className="my-4">Role</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={role}
                                            onChange={e => setRole(e.target.value)}
                                        >   <option value="0"hidden>Select</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>

                                    <button className="btn btn-primary btn-block"
                                    onClick={() => updateUserHandler(user._id)}>
                                        Update user
                                </button>
                                </div>
                    </div>
                </div>
                    </>

        </div>
        </Fragment>
    )
}

export default UserDetails
