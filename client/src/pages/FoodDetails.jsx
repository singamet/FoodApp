import { Link, useNavigate, useParams } from "react-router-dom";
import QuantitySelector from "../components/QuantitySelector";
import { useEffect, useState } from "react";
import { useAddToCart } from "../hooks/useCartContext";
import CustomButton from "../components/CustomButton";
import "../styles/FoodDetails.css";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../components/Toast";

export default function FoodDetails() {
  const [food, setFood] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading: isAddingToCart, error } = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });

  useEffect(() => {
    const getFoodItem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/food/${id}`);
        const data = await response.json();
        if (response.ok) {
          setFood(data);
        } else {
          throw new Error("Failed to fetch food items");
        }
      } catch (err) {
        console.error("Error fetching food items:", err);
      } finally {
        setIsLoading(false);
      }
    };
    getFoodItem();
  }, [id]);

  useEffect(() => {
    if (error) {
      setToast({
        message: error,
        isVisible: true,
        isError: true,
      });
    }
  }, [error]);
  const handleBuyNow = async () => {
    await addToCart(id, quantity);
    navigate("/checkout");
  };

  return (
    <>
      {isLoading ? (
        <div className="loading">
          <ClipLoader
            loading={isLoading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : food ? (
        <div className="food-details">
          <img
            src={`../images/` + food.image}
            alt={food.name}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "../images/no-image.jpg";
            }}
          />
          <div className="food-details-info">
            <div className="food-details-info-top">
              <h1>{food.name}</h1>
              <CustomButton
                isCart={false}
                foodId={food._id}
                quantity={quantity}
                isTooltip={true}
              />
            </div>
            <div className="price">
              <span>${food.price.final}</span>
              <span>${food.price.original}</span>
              <span>({food.price.offPercentage}% off)</span>
            </div>
            <p>{food.description}</p>
            <h4>Ingredients</h4>
            <div className="ingredients">
              {food.ingredients.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <div className="food-details-links">
              <QuantitySelector
                value={quantity}
                onChange={(v) => setQuantity(v)}
                disabled={isLoading || isAddingToCart}
              />
              <CustomButton
                isCart={true}
                foodId={food._id}
                quantity={quantity}
                isTooltip={false}
              />
              <Link
                onClick={handleBuyNow}
                disabled={isAddingToCart || isLoading}
                className="link-button"
              >
                {isAddingToCart || isLoading ? (
                  <ClipLoader
                    loading={isAddingToCart || isLoading}
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Buy Now"
                )}
              </Link>
            </div>
          </div>
          <Toast
            message={toast.message}
            isVisible={toast.isVisible}
            isError={toast.isError}
            onClose={() =>
              setToast({ message: "", isVisible: false, isError: false })
            }
          />
        </div>
      ) : (
        <h2>No such food item!</h2>
      )}
    </>
  );
}
