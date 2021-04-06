const express = require('express')
const router = express.Router()
const {registerUser,loginUser,logout,forgotPassword, resetPassword, getUserProfile, updatePassword, updateUserProfile,allUsers, getUserDetails,updateUserDetails, deleteUserById} = require('../controllers/userController')

const {isAuthenticatedUser, authorizeRole} = require('../middlewares/auth')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout)

router.route('/me').get(isAuthenticatedUser,getUserProfile)
router.route('/password/update').put(isAuthenticatedUser,updatePassword)
router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)

router.route('/admin/users').get(isAuthenticatedUser,authorizeRole('admin'),allUsers)
router.route('/admin/users/:id')
    .get(isAuthenticatedUser,authorizeRole('admin'),getUserDetails)
    .put(isAuthenticatedUser,authorizeRole('admin'),updateUserDetails)
    .delete(isAuthenticatedUser,authorizeRole('admin'),deleteUserById)

module.exports = router