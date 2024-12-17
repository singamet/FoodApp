const User = require('../models/userModel')
const Food = require('../models/foodModel')


const getAllCartItems = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.food')
        if (!user) {
            res.status(400).json({error: "User not found"})
        }
        res.status(200).json({cart: user.cart}) 
    }
    catch (err) {
        return res.status(400).json({error: err.message})
    }
}
const addToCart = async (req, res) => {
    const { foodId, quantity } = req.body
    try {
        const food = await Food.findById(foodId)
        if (!food) {
            return res.status(400).json({error: "Invalid Food Item"})
        }
        const user = await User.findById(req.user._id)
        const cartItem = user.cart.find(item => item.food.toString() === foodId)
        if (cartItem) {
            cartItem.quantity += quantity
        }
        else {
            user.cart.push({food: foodId, quantity})
        }
        await user.save()
        await user.populate('cart.food')
        res.status(200).json({cart: user.cart})
    }
    catch (err) {
        return res.status(400).json({error: err.message})
    }
}
const updateCart = async (req, res) => {
    const { quantity } = req.body
    const cartId = req.params.id
    try {
        const user = await User.findById(req.user._id)
        const cart = user.cart.id(cartId)
        if (!cart) {
            return res.status(400).json({error: "No such cart!"})
        }
        cart.quantity = quantity
        await user.save()
        await user.populate('cart.food')
        res.status(200).json({cart: user.cart})
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }

}
const deleteCartItem = async (req, res) => {
    const cartId = req.params.id
    try {
        const user = await User.findById(req.user._id)
        const cart = user.cart.id(cartId)
        if (!cart) {
            return res.status(400).json({error: "No such cart!"})
        }
        user.cart.pull({_id: cartId})
        await user.save()
        await user.populate('cart.food')
        res.status(200).json({cart: user.cart})
    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
}
const clearCart = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user.cart || user.cart.length === 0) {
        return res.status(400).json({ error: "No cart!" });
      }
      user.cart = []; 
      await user.save();
      res.status(200).json({ cart: user.cart });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

module.exports = {getAllCartItems, addToCart, updateCart, deleteCartItem, clearCart}