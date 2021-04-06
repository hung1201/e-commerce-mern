const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures') 
const cloudinary = require('cloudinary')
// ==============================================================
// Create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncError (async (req,res,next) => {
    let images = []
    if(typeof req.body.images ==='string') {
        images.push(req.body.images)
    }
    else {
        images = req.body.images
    }
    let imagesLinks = []

    for ( let i = 0; i < images.length; i++ ){
       const result = await cloudinary.v2.uploader.upload(images[i],{
        folder:'products',
    }) 
    imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
    })
    }
    req.body.images = imagesLinks
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})

// Get all products => /api/v1/products
exports.getProducts = catchAsyncError (async (req,res,next) => {

    const resPerPage = 8;
    const productCount = await Product.countDocuments()
    const apiFeatures = new APIFeatures(Product.find(),req.query)
                            .search()
                            .filter()
    let products = await apiFeatures.query
    let filteredProductsCount = products.length
    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query
    res.status(200).json({
        success:true,
        productCount,
        resPerPage,
        filteredProductsCount,
        products
    })
})

// Get product by id => /api/v1/products/:id
exports.getProductById = catchAsyncError (async (req,res,next) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    res.status(200).json({
        success:true,
        product
    })
})
// ========================================================================

// Get all products (admin) => /api/v1/admin/products

exports.getAdminProducts = catchAsyncError (async (req,res,next) => {
    const products = await Product.find()
    res.status(200).json({
        success:true,
        products
    })
})

//Update product by id => /api/v1/admin/products/:id
exports.updateProduct = catchAsyncError (async (req,res,next) => {
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    let images = []
    if(typeof req.body.images ==='string') {
        images.push(req.body.images)
    }
    else {
        images = req.body.images
    }
    if(images !== undefined){
        for(let i = 0 ; i < product.images.length ; i++){
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        let imagesLinks = []

    for ( let i = 0; i < images.length; i++ ){
       const result = await cloudinary.v2.uploader.upload(images[i],{
        folder:'products',
    }) 
    imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
    })
    }
    req.body.images = imagesLinks
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })
})

//Delete product by id => /api/v1/admin/products/:id
exports.deleteProductByID = catchAsyncError (async (req,res,next)=> {
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    // Delete images of products 
    for(let i = 0 ; i < product.images.length ; i++){
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await product.remove()
    res.status(200).json({
        success:true,
        message:'Product deleted'
    })
})

// Create new review => /api/v1/review
exports.createProductReview = catchAsyncError( async (req,res,next)=>{
    const { rating, comment, productId} = req.body

    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    }

    const product = await Product.findById(productId)
    // Check if product is reviewed or not
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    
    // If reviewed , then update review
    if(isReviewed){
        product.reviews.forEach( review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })
    }
    // If not, post new review
    else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc,item)=> item.rating + acc,0) / product.reviews.length

    await product.save({ validateBeforeSave:false })

    res.status(200).json({
        success:true
    })
})

// Get product reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncError (async (req,res,next)=>{
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

// Delete review by Id => /api/v1/reviews/:id
exports.deleteReview = catchAsyncError (async (req,res,next)=>{
    const product = await Product.findById(req.query.productId)

    const reviews = product.reviews.filter(review => review._id.toString()!== req.query.id.toString())

    const numOfReviews = reviews.length

    const ratings = product.reviews.reduce((acc,item)=> item.rating + acc,0) / reviews.length
    
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})