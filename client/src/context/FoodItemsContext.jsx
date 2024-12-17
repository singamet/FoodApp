import PropTypes from "prop-types";
import { createContext, useReducer } from "react";

export const FoodItemsContext = createContext();

export const foodItemsReducer = (state, action) => {
  switch (action.type) {
    case "SET_FOOD_ITEMS":
      return { foodItems: action.payload };
    case "CREATE_FOOD_ITEM":
      return { foodItems: [action.payload, ...state.foodItems] };
    case "EDIT_FOOD_ITEM":
      return {
        foodItems: state.foodItems.map((f) =>
          f._id === action.payload._id ? { ...f, ...action.payload } : f
        ),
      };
    case "DELETE_FOOD_ITEM":
      return {
        foodItems: state.foodItems.filter((f) => f._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const FoodItemsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(foodItemsReducer, { foodItems: null });
  return (
    <FoodItemsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FoodItemsContext.Provider>
  );
};
FoodItemsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
