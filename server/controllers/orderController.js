const Order = require('../models/orderModel');
const User = require('../models/userModel')
const Food = require('../models/foodModel')
const mongoose = require('mongoose')

const getAllOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({error: "User Invalid!"})
        }
        const orders = await Order.find({ user: userId }).sort({updatedAt: -1}).populate('products.food');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({error: "User Invalid!"})
        }
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid ID" });
        }
        const order = await Order.findOne({ _id: id, user: userId }).populate('products.food');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({error: "User Invalid!"})
        }
        const {email, name,  phone, status, shipping_address, tip_amount, products, additional_info } = req.body;
        if (!name || !email || !phone || !status || !shipping_address || !products) {
            return res.status(400).json({error: "All fields are required!"})
        }
        for (let product of products) {
            const foodExists = await Food.findById(product.food)
            if (!foodExists) {
                return res.status(400).json({error: `Food Item with id ${product.food} does not exist!`})
            }
        }
        const newOrder = new Order({ email, name, phone, status, shipping_address, tip_amount, products, additional_info, user: userId });
        await newOrder.save();
        await newOrder.populate('products.food');
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid ID" });
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({error: "User Invalid!"})
        }
        const { products } = req.body
        if (products) {
            for (let product of products) {
                const foodExists = await Food.findById(product.food)
                if (!foodExists) {
                    return res.status(400).json({error: `Food Item with id ${product.food} does not exist!`})
                }
            }
        }
        
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id, user: userId },
            { ...req.body },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await updatedOrder.populate('products.food');
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({error: "User Invalid!"})
        }
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid ID" });
        }
        const order = await Order.findOne({ _id: id, user: userId })
        if (order && order.status !== "Order Placed") {
            return res.status(404).json({ message: 'Order cannot be cancelled!' });
        }
        const deletedOrder = await Order.findOneAndDelete({ _id: id, user: userId });
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found!' });
        }
        await deletedOrder.populate('products.food');
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllOrders, getOrder, addOrder, updateOrder, deleteOrder };
