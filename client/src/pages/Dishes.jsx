import { useCallback, useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import { useFoodItemsContext } from "../hooks/useFoodItemsContext";
import PriceFilter from "../components/PriceFilter";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/Dishes.css";

const Dishes = () => {
  const { foodItems, dispatch } = useFoodItemsContext();
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortOrder, setSortOrder] = useState("low-to-high");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1100) {
        setIsFiltersOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/food`
        );
        const data = await response.json();
        if (response.ok) {
          dispatch({ type: "SET_FOOD_ITEMS", payload: data });
        } else {
          throw new Error("Failed to fetch food items");
        }
      } catch (err) {
        console.error("Error fetching food items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, [dispatch]);

  useEffect(() => {
    if (foodItems) {
      let items = [...foodItems];
      setCategories(
        foodItems
          ? [...new Set(foodItems.flatMap((item) => item.category))]
          : []
      );

      if (searchTerm) {
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.some((cat) =>
              cat.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      if (categoryFilters.length > 0) {
        items = items.filter((item) =>
          categoryFilters.every((filter) => item.category.includes(filter))
        );
      }

      items = items.filter(
        (item) =>
          item.price.original >= priceRange.min &&
          item.price.original <= priceRange.max
      );

      // Sorting by price
      items.sort((a, b) =>
        sortOrder === "low-to-high"
          ? a.price.original - b.price.original
          : b.price.original - a.price.original
      );

      setFilteredFoodItems(items);
    }
  }, [foodItems, categoryFilters, priceRange, sortOrder, searchTerm]);

  const handleCategoryChange = (category) => {
    setCategoryFilters((prev) =>
      prev.includes(category)
        ? prev.filter((x) => x !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = useCallback((range) => {
    setPriceRange(range);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  return (
    <div
      className="dishes-page"
      onClick={() => {
        if (isFiltersOpen) setIsFiltersOpen(false);
      }}
    >
      <button
        className="filter-button"
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
      >
        <i className="material-symbols-outlined">filter_list</i>
      </button>
      <div className={`filters ${isFiltersOpen ? "open" : ""}`}>
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchClear}>x</button>
        </div>
        <div className="priceSort">
          <h3>Sort By Price: </h3>
          <select
            name="priceSort"
            id="priceSort"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="low-to-high">Low To High</option>
            <option value="high-to-low">High To Low</option>
          </select>
        </div>
        <div className="priceFilter">
          <h3>Filter By Price: </h3>
          <PriceFilter
            minPrice={0}
            maxPrice={30}
            onPriceChange={handlePriceChange}
          />
        </div>
        <h3>Food Categories</h3>
        <div className="categories">
          {categories &&
            categories.map((x) => (
              <label key={x} className="category-label">
                <input
                  type="checkbox"
                  name={x}
                  onChange={() => handleCategoryChange(x)}
                  checked={categoryFilters.includes(x)}
                />
                <span>{x}</span>
              </label>
            ))}
        </div>
      </div>
      <div className="food-items">
        {isLoading ? (
          <div className="loading">
            <ClipLoader
              loading={isLoading}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          filteredFoodItems &&
          filteredFoodItems.map((x) => <FoodCard food={x} key={x._id} />)
        )}
      </div>
    </div>
  );
};

export default Dishes;
