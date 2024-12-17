import { useEffect, useState } from "react";
import {
  useAddToCart,
  useCartContext,
  useDeleteCartItem,
} from "../hooks/useCartContext";
import {
  useAddToFavourites,
  useFavouritesContext,
  useRemoveFromFavourites,
} from "../hooks/useFavouriteContext";
import Toast from "./Toast";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function CustomButton({ isCart, foodId, quantity, isTooltip }) {
  const [inCave, setInCave] = useState(false);
  const { cart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { favourites } = useFavouritesContext();
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });
  const {
    addToCart,
    isLoading: isAddingToCart,
    error: addToCartError,
  } = useAddToCart();
  const {
    deleteCartItem,
    isLoading: isRemovingFromCart,
    error: removeFromCartError,
  } = useDeleteCartItem();
  const {
    addToFavourites,
    isLoading: isAddingToFav,
    error: addToFavError,
  } = useAddToFavourites();
  const {
    removeFromFavourites,
    isLoading: isRemovingFromFav,
    error: removeFromFavError,
  } = useRemoveFromFavourites();
  useEffect(() => {
    if (isCart) {
      setInCave(cart ? cart.some((x) => x.food._id === foodId) : false);
    } else {
      setInCave(
        favourites ? favourites.some((x) => x.food._id === foodId) : false
      );
    }
  }, [isCart, cart, favourites, foodId]);
  useEffect(() => {
    if (addToCartError) {
      setToast({
        message: addToCartError,
        isVisible: true,
        isError: true,
      });
    }
    if (removeFromCartError) {
      setToast({
        message: removeFromCartError,
        isVisible: true,
        isError: true,
      });
    }
    if (addToFavError) {
      setToast({
        message: addToFavError,
        isVisible: true,
        isError: true,
      });
    }
    if (removeFromFavError) {
      setToast({
        message: removeFromFavError,
        isVisible: true,
        isError: true,
      });
    }
  }, [addToCartError, removeFromCartError, addToFavError, removeFromFavError]);

  const handleAdd = async (event) => {
    event.stopPropagation();
    try {
      if (user) {
        if (isCart) {
          await addToCart(foodId, quantity);
        } else {
          await addToFavourites(foodId);
        }
        setInCave(true);
        setToast({
          message: `Item added to ${isCart ? "cart" : "favourites"}!`,
          isVisible: true,
          isError: false,
        });
      } else {
        setToast({
          message: "You must be logged in!",
          isVisible: true,
          isError: true,
        });
      }
    } catch (error) {
      setToast({
        message: "Failed to add item." + error,
        isVisible: true,
        isError: true,
      });
    }
  };

  const handleRemove = async (event) => {
    event.stopPropagation();
    try {
      if (user) {
        if (isCart) {
          const deleteItems = cart.filter((x) => x.food._id === foodId);
          if (deleteItems.length > 0) {
            for (const item of deleteItems) {
              await deleteCartItem(item._id);
            }
          }
        } else {
          const removeItems = favourites.filter((x) => x.food._id === foodId);
          if (removeItems.length > 0) {
            for (const item of removeItems) {
              await removeFromFavourites(item.food._id);
            }
          }
        }
        setInCave(false);
        setToast({
          message: `Item removed from ${isCart ? "cart" : "favourites"}!`,
          isVisible: true,
          isError: false,
        });
      } else {
        navigate("/signin");
        setToast({
          message: "You must be logged in!",
          isVisible: true,
          isError: true,
        });
      }
    } catch (error) {
      setToast({
        message: "Failed to remove item." + error,
        isVisible: true,
        isError: true,
      });
    }
  };

  return (
    <>
      <button
        onClick={inCave ? handleRemove : handleAdd}
        disabled={
          isAddingToCart ||
          isRemovingFromCart ||
          isAddingToFav ||
          isRemovingFromFav
        }
        className={isTooltip ? "tooltip-button" : "link-button"}
      >
        {isAddingToCart ||
        isAddingToFav ||
        isRemovingFromCart ||
        isRemovingFromFav ? (
          <ClipLoader
            loading={
              isAddingToCart ||
              isAddingToFav ||
              isRemovingFromCart ||
              isRemovingFromFav
            }
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <>
            <i className="material-symbols-outlined">
              {isCart
                ? inCave
                  ? "remove_shopping_cart"
                  : "add_shopping_cart"
                : inCave
                ? "heart_minus"
                : "heart_plus"}
            </i>
            <span className={isTooltip ? "tooltip-text" : ""}>
              {inCave ? "Remove from" : "Add to"}{" "}
              {isCart ? "Cart" : "Favourites"}
            </span>
          </>
        )}
      </button>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        isError={toast.isError}
        onClose={() =>
          setToast({ message: "", isVisible: false, isError: false })
        }
      />
    </>
  );
}
CustomButton.propTypes = {
  isCart: PropTypes.bool.isRequired,
  foodId: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  isTooltip: PropTypes.bool.isRequired,
};
