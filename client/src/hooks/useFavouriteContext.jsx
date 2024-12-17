import { useContext, useState } from "react";
import { FavouritesContext } from "../context/FavouritesContext";
import { useAuthContext } from "./useAuthContext";

export const useFavouritesContext = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw Error("Shopping Favourites Items Context Provider Error!");
  }
  return context;
};

export const useAddToFavourites = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setFavourites } = useFavouritesContext();
  const { user } = useAuthContext();

  const addToFavourites = async (foodId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/favourites/${foodId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      } else {
        setFavourites(json.favourites);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { addToFavourites, isLoading, error };
};

export const useRemoveFromFavourites = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setFavourites } = useFavouritesContext();
  const { user } = useAuthContext();

  const removeFromFavourites = async (_id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/favourites/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      } else {
        setFavourites(json.favourites);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { removeFromFavourites, isLoading, error };
};
