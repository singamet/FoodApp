const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true  
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [
        {
            food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
            quantity: {type:Number, required: true}
        }
    ],
    favourites: [
        {
            food: { type: Schema.Types.ObjectId, ref: "Food", required: true }
        }
    ],
    
},{timestamps: true})

userSchema.statics.signup = async function(fullname, email, password) {
    if (!email || !password || !fullname) {
        throw Error("All fields are required!")
    }
    if (!validator.isEmail(email)) {
        throw Error("Invalid Email!")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough!")
    }
    const exists = await this.findOne({ email })
    if (exists) {
        throw Error("Email already exists")
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = this.create({ fullname, email, password: hash })
    return user
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields are required!")
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error("Invalid Login")
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error("Invalid Login")
    }
    return user
}
module.exports = mongoose.model('User', userSchema)