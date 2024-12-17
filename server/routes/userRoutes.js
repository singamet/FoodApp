const express = require('express')
const { loginUser, signupUser, logoutUser } = require('../controllers/userController')
const { getAllFavItems, addToFavs, removeFromFav } = require('../controllers/favouritesController')
const { getAllCartItems, addToCart, updateCart, deleteCartItem, clearCart } = require('../controllers/cartController')
const { getAllOrders, getOrder, addOrder, updateOrder, deleteOrder } = require('../controllers/orderController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.post('/logout', logoutUser)

router.use(requireAuth)

router.get('/cart', getAllCartItems)
router.post('/cart', addToCart)
router.patch('/cart/:id', updateCart)
router.delete('/cart/:id', deleteCartItem)
router.delete('/cart', clearCart)

router.get('/favourites', getAllFavItems)
router.post('/favourites/:id', addToFavs)
router.delete('/favourites/:id', removeFromFav)

router.get('/order', getAllOrders)
router.get('/order/:id', getOrder)
router.post('/order', addOrder)
router.patch('/order/:id', updateOrder)
router.delete('/order/:id', deleteOrder)


module.exports = router