import './App.css';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import store from './store'
import { useEffect,useState } from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {loadUser} from './action/userActions'
import { useSelector } from 'react-redux';
// ==================================================================
import Home from './components/Home';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ProtectedRoute from './components/route/ProtectedRoute'
// ==================================================================
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import { NewPassword } from './components/user/NewPassword';
// ==================================================================
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
// ==================================================================
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
// ==================================================================
import ProductDetails from './components/product/ProductDetails'
// ==================================================================
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UserDetails from './components/admin/UserDetails';
import ProductReviews from './components/admin/ProductReviews';
import Slider from './components/layout/Slider';
// ==================================================================
function App() {
  const [stripeApiKey,setStripeApiKey] = useState('')
  const {user,isAuthenticated,loading} = useSelector(state => state.userR)
  useEffect(()=>{
    store.dispatch(loadUser())
    async function getStripeApiKey(){
      const { data } = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey()
  },[stripeApiKey])
  return (
    <Router>
      <div>
        <Header/>
        <div className="container container-fluid">
          <h1 id="products_heading">Newest Products</h1>
        </div>
        
        <Slider/>
        <div className="container container-fluid">

        {/* ============================================================== */}
        
        <Route exact path="/" component={Home}/>
        <Route exact path="/search/:keyword" component={Home}/>

        {/* ============================================================== */}

        <Route exact path="/products/:id" component={ProductDetails}/>

        {/* ============================================================== */}

        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register} />
        <ProtectedRoute exact path="/password/update" component={UpdatePassword}/>
        <Route exact path="/password/forgot" component={ForgotPassword}/>
        <Route exact path="/password/reset/:token" component={NewPassword}/>

        {/* ============================================================== */}

        <ProtectedRoute exact path="/me" component={Profile}/>
        <ProtectedRoute exact path="/me/update" component={UpdateProfile}/>

        {/* ============================================================== */}

        <ProtectedRoute exact path="/cart" component={Cart}/>
        <ProtectedRoute exact path="/shipping" component={Shipping}/>
        <ProtectedRoute exact path="/confirm" component={ConfirmOrder}/>
        {
          stripeApiKey &&  
          <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path='/payment' component={Payment}/>
          </Elements>
        }
        <ProtectedRoute exact path='/success' component={OrderSuccess}/>

        {/* ============================================================== */}

        <ProtectedRoute exact path='/orders/me' component={ListOrders}/>
        <ProtectedRoute exact path='/order/:id' component={OrderDetails}/>

        {/* ============================================================== */}
        </div>
        <ProtectedRoute exact path='/dashboard' isAdmin={true} component={Dashboard}/>
        <ProtectedRoute exact path='/admin/products' isAdmin={true} component={ProductsList}/>
        <ProtectedRoute exact path='/admin/product/new' isAdmin={true} component={NewProduct}/>
        <ProtectedRoute exact path='/admin/products/:id' isAdmin={true} component={UpdateProduct}/>
        <ProtectedRoute exact path='/admin/orders' isAdmin={true} component={OrderList}/>
        <ProtectedRoute exact path='/admin/order/:id' isAdmin={true} component={ProcessOrder}/>
        <ProtectedRoute exact path='/admin/users' isAdmin={true} component={UsersList}/>
        <ProtectedRoute exact path='/admin/users/:id' isAdmin={true} component={UserDetails}/>
        <ProtectedRoute exact path='/admin/reviews' isAdmin={true} component={ProductReviews}/>
        
        {
          !loading && (!isAuthenticated|| user.role!== 'admin') && (
            <Footer/>
  )
        }
        
      </div>
    </Router>
    
  );
}

export default App;
