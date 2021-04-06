
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter product name'],
        trim:true,
        maxLength:[100,'Product name < 100 characters']
    },
    price:{
        type:Number,
        required:[true,'Please enter product price'],
        maxLength:[5,'Product price < 5 characters'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,'Please select product category'],
        enum: {
            values:[
                'Car',
                'Motor',
                'Laptop',
                'Phone',
                'Skincare',
                'Clothes',
                'Shoes',
            ],
            message:'Please select category'
        }
    },
    seller:{
        type:String,
        required:[true,'Please enter product seller']
    },
    stock:{
        type:Number,
        required:[true,'Please enter product quantity'],
        maxLength:[5,'Product quantity < 5 characters']
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Product',productSchema)