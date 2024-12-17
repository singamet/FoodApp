import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { FoodItemsContextProvider } from "./context/FoodItemsContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { CartContextProvider } from "./context/CartContext";
import { OrderContextProvider } from "./context/OrderContext.jsx";
import { FavouritesContextProvider } from "./context/FavouritesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FoodItemsContextProvider>
      <AuthContextProvider>
        <OrderContextProvider>
          <CartContextProvider>
            <FavouritesContextProvider>
              <App />
            </FavouritesContextProvider>
          </CartContextProvider>
        </OrderContextProvider>
      </AuthContextProvider>
    </FoodItemsContextProvider>
  </StrictMode>
);
