import { useEffect } from "react";
import FoodCard from "../components/FoodCard";
import { Link } from "react-router-dom";
import { useFoodItemsContext } from "../hooks/useFoodItemsContext";

const Home = () => {
  const { foodItems, dispatch } = useFoodItemsContext();

  useEffect(() => {
    const fetchFoodItems = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/food`);
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_FOOD_ITEMS", payload: json });
      }
    };
    fetchFoodItems();
  }, [dispatch]);

  return (
    <div className="home">
      <Link to="/dishes">
        <img src="../images/Header.png" alt="" />
      </Link>
      <div className="home-title">
        <h1>Featured Items</h1>
        <Link to="/dishes">
          <h3>View All</h3>
        </Link>
      </div>
      <div className="food-items">
        {foodItems &&
          foodItems.slice(0, 8).map((x) => <FoodCard key={x._id} food={x} />)}
      </div>
    </div>
  );
};
export default Home;
