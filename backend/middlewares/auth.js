
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require('../models/user')

// Check if user is authenticated
exports.isAuthenticatedUser = catchAsyncError(async(req,res,next) => {
    const { token } = req.cookies
    
    // If token doesn't exist
    if(!token){
        return next(new ErrorHandler('Please login first'),401)
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
})

// Handling user role
exports.authorizeRole = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(
               new ErrorHandler(`Role (${req.user.role}) is not allowed to access`,403) 
            )
        }
        next()
    }
}