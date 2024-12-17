const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const Blacklist = require('../models/blacklistToken')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({error: "Authorization token Required"})
    }
    const token = authorization.split(' ')[1]
    const blacklist = await Blacklist.findOne({ token })
    if (blacklist) {
        return res.status(400).json({error:"Token is invalidated!"})
    }
    try {
        const { _id } = jwt.verify(token, process.env.SECRET)
        req.user = await User.findOne({ _id }).select('_id')
        next()
    }
    catch (error) {
        res.status(401).json({ error: error.message })
    }
}
module.exports = requireAuth;