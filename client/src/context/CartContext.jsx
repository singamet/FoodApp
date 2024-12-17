import { createContext, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import PropTypes from "prop-types";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/cart`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (response.ok) {
            const json = await response.json();
            setCart(json.cart);
          } else {
            console.error("Failed to fetch cart items:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("User must be logged in to fetch cart items");
      }
    };
    fetchCartItems();
  }, [user]);
  return (
    <CartContext.Provider value={{ cart, setCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};
CartContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
