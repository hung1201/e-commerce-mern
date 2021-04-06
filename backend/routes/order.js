const express = require('express')
const router = express.Router()

const { newOrder, getOrderById, getMyOrders, getAllOrders, updateOrder, deleteOrderById } = require('../controllers/orderController')

const { isAuthenticatedUser,authorizeRole } = require('../middlewares/auth')

router.route('/order/new').post(isAuthenticatedUser,newOrder)
router.route('/order/:id').get(isAuthenticatedUser,getOrderById)
router.route('/orders/me').get(isAuthenticatedUser,getMyOrders)

router.route('/admin/orders').get(isAuthenticatedUser,authorizeRole('admin'),getAllOrders)

router.route('/admin/order/:id')
    .put(isAuthenticatedUser,authorizeRole('admin'),updateOrder)
    .delete(isAuthenticatedUser,authorizeRole('admin'),deleteOrderById)
    
module.exports = router