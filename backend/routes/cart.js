const express = require('express')
const router = express.Router()

const { newCart,getCartItems } = require('../controllers/cartController')
const { isAuthenticatedUser } = require('../middlewares/auth')
router.route('/cart').post(isAuthenticatedUser,newCart)
router.route('/cart/list').get(isAuthenticatedUser,getCartItems)
module.exports = router