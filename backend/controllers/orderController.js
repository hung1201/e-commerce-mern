const Order = require('../models/order')
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')

// Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user: req.user._id
    })
    res.status(200).json({
        success:true,
        order
    })
})

// Get order by id => /api/v1/order/:id
exports.getOrderById = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email')

    if(!order){
        return next(new ErrorHandler('No order found with this ID',400))
    }
    res.status(200).json({
        success:true,
        order
    })
})

// Get logged in user order => /api/v1/orders/me
exports.getMyOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({
        user: req.user.id
    })
    res.status(200).json({
        success:true,
        ordersLength:orders.length,
        orders
    })
})


// ======================ADMIN===========================

// Get all order => /api/v1/admin/orders
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        ordersLength:orders.length,
        orders
    })
})

// Update / Process order => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('You have delivered this order',400))
    }
    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    
    await order.save()
    res.status(200).json({
        success:true,
    })
})

async function updateStock(id,quantity){
    const product = await Product.findById(id)
    product.stock = product.stock - quantity

    await product.save({
        validateBeforeSave:false
    })
}

// Delete order by id => /api/v1/admin/order/:id
exports.deleteOrderById = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler('No order found with this ID',400))
    }
    await order.remove()
    res.status(200).json({
        success:true,
    })
})