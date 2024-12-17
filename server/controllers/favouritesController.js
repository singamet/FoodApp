const User = require('../models/userModel');
const Food = require('../models/foodModel');

const getAllFavItems = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favourites.food');
        if (!user) {
            return res.status(400).json({error: "User not found"});
        }
        return res.status(200).json({favourites: user.favourites});
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
};

const addToFavs = async (req, res) => {
    const foodId = req.params.id;
    try {
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(400).json({error: "Invalid Food Item"});
        }
        const user = await User.findById(req.user._id);
        const alreadyFav = user.favourites.find(item => item.food.toString() === foodId);
        if (alreadyFav) {
            return res.status(400).json({error: "Food Item already in favourites"});
        } else {
            user.favourites.push({food: foodId});
        }
        await user.save();
        await user.populate('favourites.food');
        return res.status(200).json({favourites: user.favourites});
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
};

const removeFromFav = async (req, res) => {
    const foodId = req.params.id;
    try {
        const user = await User.findById(req.user._id);
        const inFav = user.favourites.find(item => item.food.toString() === foodId);
        if (!inFav) {
            return res.status(400).json({error: "Food Item not in Favourites!"});
        }
        user.favourites = user.favourites.filter(item => item.food.toString() !== foodId);
        await user.save();
        await user.populate('favourites.food');
        return res.status(200).json({favourites: user.favourites});
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
};

module.exports = {getAllFavItems, addToFavs, removeFromFav};
