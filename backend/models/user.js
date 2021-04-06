const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        maxLength:[30,'Name < 30 characters']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        validate:[validator.isEmail,'Please enter valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minLength:[6,'Password must longther than 6 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date
})

// Encrypt password before save
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

// Compare User password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

// Return Json Web Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({
        id:this._id
    },
    process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE_TIME
    }
    )
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('User',userSchema)