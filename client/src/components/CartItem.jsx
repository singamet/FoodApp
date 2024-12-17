import QuantitySelector from "./QuantitySelector";
import { useUpdateCartItem, useDeleteCartItem } from "../hooks/useCartContext";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Toast from "./Toast";
import PropTypes from "prop-types";

export default function CartItem({ cartItem }) {
  const {
    deleteCartItem,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteCartItem();
  const {
    updateCartItem,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateCartItem();
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });
  useEffect(() => {
    if (deleteError) {
      setToast({
        message: deleteError,
        isVisible: true,
        isError: true,
      });
    }
    if (updateError) {
      setToast({
        message: updateError,
        isVisible: true,
        isError: true,
      });
    }
  }, [deleteError, updateError]);
  const imgSrc = `../images/${cartItem.food.image}`;
  const calculateSubtotal = (price, qty) => {
    return (price * qty).toFixed(2);
  };

  return (
    <>
      {isDeleting || isUpdating ? (
        <div className="cart-item-loading">
          <ClipLoader
            loading={isDeleting || isUpdating}
            size={75}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="cart-item">
          <Link
            to={`/dishes/${cartItem.food._id}`}
            className="cart-item-details"
          >
            <img
              src={imgSrc}
              alt="Cart Food Image"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "../images/no-image.jpg";
              }}
            />
            <section>
              <h3>{cartItem.food.name}</h3>
              <p>{cartItem.food.description}</p>
            </section>
          </Link>

          <h4>${cartItem.food.price.final}</h4>
          <QuantitySelector
            value={cartItem.quantity}
            onChange={(value) => updateCartItem(cartItem._id, value)}
            disabled={isDeleting || isUpdating}
          />
          <h4>
            ${calculateSubtotal(cartItem.food.price.final, cartItem.quantity)}
          </h4>

          <button
            onClick={() => deleteCartItem(cartItem._id)}
            disabled={isUpdating || isDeleting}
          >
            x
          </button>
          <Toast
            message={toast.message}
            isVisible={toast.isVisible}
            isError={toast.isError}
            onClose={() =>
              setToast({ message: "", isVisible: false, isError: false })
            }
          />
        </div>
      )}
    </>
  );
}
CartItem.propTypes = {
  cartItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    food: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.shape({ final: PropTypes.number.isRequired }).isRequired,
    }).isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};
