import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Search from './Search'
import {Route} from 'react-router-dom'
import { useDispatch,useSelector} from 'react-redux'
import {useAlert} from 'react-alert'
import {logout} from '../../action/userActions'
import { navClick } from '../../action/clickAction'
import { getProducts } from '../../action/productActions'
// ===================================================================
const Header = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cart)
    const {user, loading } = useSelector(state => state.userR)
    const logoutHandler = () => {
        dispatch(logout())
        alert.success('Logged out successfully')
    }
    const categories = [
        'Car',
        'Motor',
        'Laptop',
        'Phone',
        'Skincare',
        'Clothes',
        'Shoes',
    ]
    return (
<Fragment>
<nav className="navbar row">
<div className="col-12 col-md-2">
<div className="navbar-brand" >
    <Link to="/">
<img src="/images/logo.png" style={{width:150,height:50}} alt="logo"/>
    </Link>
</div>
</div>
<div className="col-12 col-md-6 mt-2 mt-md-0">
    <Route render={({history})=> <Search history={history}/>} />
</div>
<div className="col-12 col-md-4 mt-4 mt-md-0 text-center">
    <Link to="/cart" style={{textDecoration:'none'}}>
<span id="cart" className="ml-3">Cart</span>
<span className="ml-1" id="cart_count">{user ? cartItems.length : '0'}</span>
    </Link>
        {
        user ? (
<div className="ml-4 dropdown d-inline">
        <Link to="/" className="btn dropdown-toggle mr-4 text-white" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
<figure className="avatar avatar-nav">
        <img src={user.avatar && user.avatar.url} alt={user && user.name}
        className="rounded-circle"/>
</figure>
<span>{ user && String(user.name).split(' ')[0] }</span>
        </Link>
<div className="dropdown-menu mt-4" aria-labelledby="dropDownMenuButton">
        {
        user && user.role === 'admin' && 
        (
        <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
        ) 
        }
        <Link className="dropdown-item" to="/orders/me">My Orders</Link>
        <Link className="dropdown-item" to="/me">Profile</Link>
        <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>Logout</Link>
</div>
</div>
        ) 
            : 
        (
        !loading 
        && 
        <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>
        )
        }
</div>
</nav>
{/* <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav d-flex w-100 justify-content-center align-items-center">
    {
            categories.map(category => (
                <Link className="nav-item nav-link mr-2" key={category}
                    style={{cursor:'pointer', color:'#fa0f0f'}}
                    onClick={()=>navHandler(category)}
                    to={`/`}
                    >
                    {category}
                </Link>
            ))
        }

    </div>
  </div>
</nav> */}
</Fragment>
    )
}

export default Header
