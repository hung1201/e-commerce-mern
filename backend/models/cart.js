const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    products:[
        {
            name: {
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Product'
            },
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    active: {
        type: Boolean,
        default: true
      },
      modifiedOn: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
)
module.exports = mongoose.model('Cart',cartSchema)