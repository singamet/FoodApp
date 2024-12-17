import { useState } from "react";
import { useCartContext } from "../hooks/useCartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAddOrder } from "../hooks/useOrderContext";
import "../styles/Checkout.css";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../components/Toast";

export default function Checkout() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    shipping_address: "",
    additional_info: "",
    tip_amount: 0,
  });
  const [customTip, setCustomTip] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(null); // Track selected tip percentage
  const tipOptions = [5, 10, 20]; // Tip options array
  const { addOrder, error, isLoading } = useAddOrder();
  const { cart } = useCartContext();
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "tip_amount" ? Number(value) : value, // Convert tip_amount to a number
    }));
  }

  const handleTipChange = (percentage) => {
    const total = calculateTotal();
    setTipPercentage(percentage);
    setCustomTip(false);
    const tipAmount = ((percentage / 100) * total).toFixed(2);
    setFormData((prevFormData) => ({
      ...prevFormData,
      tip_amount: parseFloat(tipAmount),
    }));
  };

  const handleCustomTip = () => {
    setCustomTip(true);
    setTipPercentage(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      tip_amount: 0,
    }));
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const subtotal = item.food.price.final * item.quantity;
        return total + subtotal;
      }, 0)
      .toFixed(2);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (cart.length > 0) {
      await addOrder(
        formData.email,
        formData.name,
        formData.phone,
        "Order Placed",
        formData.shipping_address,
        formData.tip_amount,
        formData.additional_info,
        cart
      );
      if (!error) {
        navigate("/orders");
      } else {
        setToast({
          message: error,
          isVisible: true,
          isError: true,
        });
      }
    } else {
      navigate("/dishes");
    }
  }

  return (
    <div className="checkout-page">
      <form onSubmit={handleSubmit}>
        <div className="checkout-form">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            disabled={isLoading}
            required
          />
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            disabled={isLoading}
            onChange={handleFormChange}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            name="phone"
            disabled={isLoading}
            value={formData.phone}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            placeholder="Shipping Address"
            disabled={isLoading}
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleFormChange}
            required
          />
          <textarea
            placeholder="Additional Information"
            disabled={isLoading}
            name="additional_info"
            value={formData.additional_info}
            onChange={handleFormChange}
          ></textarea>
          <h4>Please add a tip: </h4>
          <div className="tip-menu">
            {tipOptions.map((percentage) => (
              <div key={percentage}>
                <input
                  type="radio"
                  id={`tip-${percentage}`}
                  name="tip"
                  value={percentage}
                  checked={tipPercentage === percentage}
                  onChange={() => handleTipChange(percentage)}
                  disabled={isLoading}
                />
                <label htmlFor={`tip-${percentage}`}>{percentage}%</label>
              </div>
            ))}
            <div>
              <input
                type="radio"
                id="tip-custom"
                name="tip"
                value="custom"
                checked={customTip}
                onChange={handleCustomTip}
                disabled={isLoading}
              />
              <label htmlFor="tip-custom">Custom</label>
            </div>
            {customTip && (
              <div className="custom-tip-input">
                <span>$</span>
                <input
                  type="number"
                  placeholder="Enter custom tip amount"
                  name="tip_amount"
                  value={formData.tip_amount}
                  onChange={handleFormChange}
                  disabled={isLoading}
                  required
                />
              </div>
            )}
          </div>
        </div>
        <div className="checkout-visual">
          <div className="checkout-food">
            {cart &&
              cart.map((c) => (
                <div key={c._id} className="checkout-food-item">
                  <h3>{c.quantity} x</h3>
                  <Link
                    to={`/dishes/${c.food._id}`}
                    className="checkout-food-item-details"
                  >
                    <img
                      src={`../images/${c.food.image}`}
                      alt=""
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "../images/no-image.jpg";
                      }}
                    />
                    <section>
                      <h4>{c.food.name}</h4>
                      <p>{c.food.description}</p>
                      <h3>$ {c.food.price.final}</h3>
                    </section>
                  </Link>
                </div>
              ))}
          </div>
          <div className="checkout-summary">
            <div className="checkout-total">
              <div className="checkout-total-cell">
                <h3>Total Sum</h3>
                <h3>${calculateTotal()}</h3>
              </div>
              <div className="checkout-total-cell">
                <h3>Service charge (7%)</h3>
                <h3>${(calculateTotal() * 0.07).toFixed(2)}</h3>
              </div>
              <div className="checkout-total-cell">
                <h3>Tip</h3>
                <h3>${formData.tip_amount}</h3>
              </div>
              <div className="checkout-total-cell">
                <h3>Grand Total</h3>
                <h3>
                  {(
                    calculateTotal() * (1 + 0.07) +
                    formData.tip_amount
                  ).toFixed(2)}
                </h3>
              </div>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <ClipLoader
                  loading={isLoading}
                  size={35}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </form>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        isError={toast.isError}
        onClose={() =>
          setToast({ message: "", isVisible: false, isError: false })
        }
      />
    </div>
  );
}
