const Food = require('../models/foodModel');
const mongoose = require('mongoose');

const createFoodItem = async (req, res) => {
    const { name, description, price, ingredients, image, category } = req.body;

    if (!name || !description || !price || !ingredients || !category) {
        return res.status(400).json({ error: "All fields must be filled." });
    }

    const imageUrl = image || "no-image.png";

    try {
        const foodItem = await Food.create({ name, description, price, ingredients, image: imageUrl, category });
        res.status(201).json(foodItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllFoodItems = async (req, res) => {
    const { categories, min, max, sort } = req.query;
    //console.log(req.query)
    let filter = {};
  
    if (categories) {
        const categoryArray = categories.split(',');
        filter["category"] = { $in: categoryArray };
    }
  
    if (min && max) {
        const minPrice = parseFloat(min);
        const maxPrice = parseFloat(max);
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            filter["price.original"] = { $gte: minPrice, $lte: maxPrice };
        } else {
            return res.status(400).json({ error: "Min and max prices must be valid numbers" });
        }
    }
  
    let sortOption = {};
    if (sort) {
        if (sort === "low-to-high") {
            sortOption["price.original"] = 1; // Ascending order
        }
        else if (sort === "high-to-low") {
            sortOption["price.original"] = -1; // Descending order
        }
        else {
            sortOption["createdAt"] = -1;
        }
        
    }
    console.log("Filter object:",filter)
    try {
      const foodItems = await Food.find(filter).sort(sortOption);
      res.status(200).json(foodItems);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  

const getSingleFoodItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID!" });
    }

    try {
        const foodItem = await Food.findById(id);

        if (!foodItem) {
            return res.status(404).json({ error: "No such food item!" });
        }

        res.status(200).json(foodItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateFoodItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }
    try {
        const updated = await Food.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: "Food Item not updated" });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteFoodItem = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }
    try {
        const deleted = await Food.findByIdAndDelete({ _id: id });
        if (!deleted) {
            return res.status(404).json({ error: "Food Item not deleted" });
        }
        res.status(200).json(deleted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    createFoodItem,
    getAllFoodItems,
    getSingleFoodItem,
    updateFoodItem,
    deleteFoodItem,
};
