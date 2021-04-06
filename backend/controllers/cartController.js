const Cart = require('../models/cart')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
// Add item to cart => /api/v1/cart
exports.newCart = catchAsyncError(async(req,res,next)=>{
    const { product,name,quantity,price } = req.body;
    try {
        let cart = await Cart.findOne({user: req.user._id})
        if(cart){
            let item = cart.products.findIndex(p => p.product == product )
            if(item > -1) {
                let productItem = cart.products[item]
                productItem.quantity += quantity
                cart.products[item] = productItem
            }
            else {
                cart.products.push({
                    product,
                    name,
                    quantity,
                    price 
                })
            }
            cart = await cart.save(
                {
                    validateBeforeSave:false
                }
            )
            res.status(200).json({
                success:true,
                cart
            })
        }
        else {
            const newCart = await Cart.create({
                user: req.user._id,
                products: [{
                    product,
                    name,
                    quantity,
                    price 
                }]
            })
            res.status(200).json({
                success:true,
                newCart
            })
        }
    } catch (error) {
        return (next (new ErrorHandler(error,500)))
    }        
})

// Get all cart items of user => /api/v1/cart/list
exports.getCartItems = catchAsyncError( async(req,res,next) => {
        const cartItems = await Cart.findOne({user: req.user._id})
    res.status(200).json({
        success:true,
        cartItems
    })
})