import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignOut = () => {
  const { user, dispatch } = useAuthContext();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const signout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        localStorage.removeItem("user");
        dispatch({ type: "SIGNOUT" });
      } else {
        setError(json.error);
      }
      return json;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return { signout, isLoading, error };
};
