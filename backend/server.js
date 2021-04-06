const app = require('./app')
// const dotenv = require('dotenv')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary')
// ============================================
//Handle uncaught exceptions
process.on('uncaughtException',err => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down server due to uncaught exceptions')
    process.exit(1)
}) 

//Setting config file
if(process.env.NODE_ENV !== 'PRODUCTION') 
    require('dotenv').dotenv.config({path:'backend/config/config.env'})


//Connect to db
connectDatabase()

// Setting cloudinary config
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server listen on ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

//Handle unhandeled promise rejections ( fail to connect to db)
process.on('unhandledRejection',err => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down server due to unhandeled promise rejections`)
    server.close(()=>{
        process.exit(1)
    })
})