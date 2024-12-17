import PropTypes from "prop-types";
import { createContext, useReducer } from "react";

export const OrderContext = createContext();

const orderReducer = (state, action) => {
  switch (action.type) {
    case "SET_ORDERS":
      return { orders: action.payload };
    case "ADD_ORDER":
      return { orders: [action.payload, ...state.orders] };
    case "UPDATE_ORDER":
      return {
        orders: state.orders.map((o) =>
          o._id === action.payload._id ? { ...o, ...action.payload } : o
        ),
      };
    case "DELETE_ORDER":
      return {
        orders: state.orders.filter((o) => o._id !== action.payload),
      };
  }
};

export const OrderContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, { orders: [] });

  return (
    <OrderContext.Provider value={{ ...state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};
OrderContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
