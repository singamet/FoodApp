const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    shipping_address: {
        type: String,
        required: true
    },
    additional_info: {
        type: String
    },
    tip_amount: {
      type: Number, 
      default: 0
    },
    products: {
        type: [
          {
            food: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Food",
              required: true,
            },
            quantity: { type: Number, default: 1 },
          },
        ],
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

orderSchema.virtual("total_amount").get(function () {
  const productsTotal = this.products.reduce((total, product) => {
    if (product.food && product.food.price && product.food.price.final) {
      return total + ((1 + 0.07) * (product.quantity * product.food.price.final));
    }
    return total;
  }, 0);

  return productsTotal + this.tip_amount; 
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
