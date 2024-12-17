import { useContext } from "react"
import { FoodItemsContext } from "../context/FoodItemsContext"

export const useFoodItemsContext = () => {
    const context = useContext(FoodItemsContext)
    if (!context) {
        throw Error("Food Items Context Provider Error!")
    }
    return context
}