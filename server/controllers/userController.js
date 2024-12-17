const User = require('../models/userModel')
const Food = require('../models/foodModel')
const jwt = require('jsonwebtoken')
const Blacklist = require('../models/blacklistToken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1d'})
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({email, token})
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signupUser = async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        const user = await User.signup(fullname, email, password)
        // console.log("User: ", user)
        const token = createToken(user._id)
        res.status(200).json({email, token})
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(404).json({error: "Token is required!"})
        }
        const blacklistedToken = new Blacklist({ token })
        await blacklistedToken.save()
        res.status(200).json({success: true, message: "User logged out successfully!"})
    }
    catch (err) {
        res.status(500).json({success: false, error: err.message})
    }
}

module.exports = {loginUser, signupUser, logoutUser}