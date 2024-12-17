import { createContext, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import PropTypes from "prop-types";

export const FavouritesContext = createContext();

export const FavouritesContextProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchFavItems = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/favourites`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (response.ok) {
            const json = await response.json();
            setFavourites(json.favourites);
          } else {
            console.error(
              "Failed to fetch favourite items:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching favourite items:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("User must be logged in to fetch favourite items");
      }
    };
    fetchFavItems();
  }, [user]);
  return (
    <FavouritesContext.Provider
      value={{ favourites, setFavourites, isLoading }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
FavouritesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
