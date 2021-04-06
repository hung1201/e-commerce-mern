const express = require('express')
const router = express.Router()

const { getProducts,newProduct,getProductById,updateProduct,deleteProductByID, createProductReview, getProductReviews, deleteReview,getAdminProducts } = require('../controllers/productController')
const {isAuthenticatedUser,authorizeRole} = require('../middlewares/auth')


router.route('/products').get(getProducts)
router.route('/products/:id').get(getProductById)
// =============================================================
router.route('/review').put(isAuthenticatedUser,createProductReview)                    
router.route('/reviews')
        .get(isAuthenticatedUser,getProductReviews)   
        .delete(isAuthenticatedUser,deleteReview)
// ============================================================
router.route('/admin/products').get(isAuthenticatedUser,authorizeRole('admin'),getAdminProducts)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRole('admin'),newProduct)
router.route('/admin/products/:id')
                    .put(isAuthenticatedUser,authorizeRole('admin'),updateProduct)
                    .delete(isAuthenticatedUser,authorizeRole('admin'),deleteProductByID)


module.exports = router