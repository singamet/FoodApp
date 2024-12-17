import ClipLoader from "react-spinners/ClipLoader";
import FoodCard from "../components/FoodCard";
import { useFavouritesContext } from "../hooks/useFavouriteContext";

export default function Favourites() {
  const { favourites, isLoading } = useFavouritesContext();
  return (
    <>
      {isLoading ? (
        <ClipLoader
          loading={isLoading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : favourites && favourites.length > 0 ? (
        <div className="favourites-page">
          {favourites.map((fav) => (
            <FoodCard key={fav.food._id} food={fav.food} />
          ))}
        </div>
      ) : (
        <h2>You have no favourites!</h2>
      )}
    </>
  );
}
