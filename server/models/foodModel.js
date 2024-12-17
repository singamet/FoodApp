const mongoose = require('mongoose')
const Schema = mongoose.Schema

const foodSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: {
          original: { type: Number, default: 0.0 },
          final: { type: Number, default: 0.0 },
          offPercentage: { type: Number, default: 0 },
        },
        default: { original: 0.0, final: 0.0, offPercentage: 0 },
      },
      category: {
        type: [String],
        default: [],
      },
      ingredients: {
        type: [String],
        required: true,
      },
    },
    { timestamps: true }
  )

module.exports = mongoose.model("Food", foodSchema)