import PropTypes from "prop-types";
import { createContext, useEffect, useReducer, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return { user: action.payload };
    case "SIGNOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const verifyUser = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/user/cart`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (response.ok) {
            dispatch({ type: "SIGNIN", payload: user });
          } else {
            if (response.statusText.includes("Unauthorized")) {
              localStorage.removeItem("user");
              dispatch({ type: "SIGNOUT" });
            }
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    verifyUser();
  }, []);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
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
        children
      )}
    </AuthContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
