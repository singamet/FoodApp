import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCartContext } from "../hooks/useCartContext";
import "../styles/Cart.css";
import ClipLoader from "react-spinners/ClipLoader";

export default function Cart() {
  const { cart, isLoading } = useCartContext();
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const subtotal = item.food.price.final * item.quantity;
        return total + subtotal;
      }, 0)
      .toFixed(2);
  };
  return (
    <>
      {isLoading ? (
        <ClipLoader
          loading={isLoading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : cart && cart.length > 0 ? (
        <div className="cart-page">
          <div className="cart-container">
            <div className="cart-header">
              <h4>Food</h4>
              <h4>Price</h4>
              <h4>Quantity</h4>
              <h4>Subtotal</h4>
            </div>
            <div className="cart-body">
              {cart && cart.map((c) => <CartItem key={c._id} cartItem={c} />)}
            </div>
          </div>
          <div className="cart-total">
            <div className="cart-total-cell">
              <h3>Total Sum </h3>
              <h3>${calculateTotal()}</h3>
            </div>
            <div className="cart-total-cell">
              <h3>Service charge (7%)</h3>
              <h3>${(calculateTotal() * 0.07).toFixed(2)}</h3>
            </div>
            <div className="cart-total-cell">
              <h3>Grand Total </h3>
              <h3>${(calculateTotal() * (1 + 0.07)).toFixed(2)}</h3>
            </div>

            <Link to="/checkout">Proceed to Checkout</Link>
          </div>
        </div>
      ) : (
        <h1>Food Cart is empty!</h1>
      )}
    </>
  );
}
