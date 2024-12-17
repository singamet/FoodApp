const express = require('express')
const router = express.Router()
const { createFoodItem,
    getAllFoodItems,
    getSingleFoodItem,
    deleteFoodItem,
    updateFoodItem} = require('../controllers/foodController')

router.get('/', getAllFoodItems)
router.get('/:id', getSingleFoodItem)

router.post('/', createFoodItem)
router.delete('/:id', deleteFoodItem)
router.patch('/:id', updateFoodItem)
module.exports = router