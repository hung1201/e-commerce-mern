import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { adminProductReducer, getReviewsReducer, newProductReducer, newReviewReducer, productDetailReducers, productReducers, productSliderReducers } from './reducer/productReducers'
import { adminUserReducer, allUsersReducer, forgotPasswordReducer, userDetailReducers, userProfileReducer, userReducer } from './reducer/userReducers'
import { cartReducers } from './reducer/cartReducers'
import { adminOrdersReducers, myOrdersReducer, newOrderReducer, orderDetailsReducer, updateOrderReducer } from './reducer/orderReducers'
import { onClickReducer } from './reducer/onClickReducer'
const reducer = combineReducers({
    products:productReducers,
    productDetails : productDetailReducers,
    userR : userReducer,
    userP : userProfileReducer,
    forgotP : forgotPasswordReducer,
    cart : cartReducers,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview : newReviewReducer,
    newProduct : newProductReducer,
    adminProduct: adminProductReducer,
    adminOrder: adminOrdersReducers,
    updateOrder: updateOrderReducer,
    allUsers: allUsersReducer,
    adminUsers: adminUserReducer,
    userDetails: userDetailReducers,
    getReviews : getReviewsReducer,
    onClick: onClickReducer,
    productsSlide: productSliderReducers,
})

let initialState = {
    cart:{
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    }
}

const middleware = [thunk]

const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store

