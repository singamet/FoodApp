import { useCallback, useContext, useState } from "react";
import { OrderContext } from "../context/OrderContext";
import { useAuthContext } from "./useAuthContext";
import { useCartContext } from "./useCartContext";

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw Error("Order Context Provider Error!");
  }
  return context;
};

export const useFetchOrders = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useOrderContext();
  const { user } = useAuthContext();
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      if (user) {
        const response = await fetch("/api/user/order", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: "SET_ORDERS", payload: json });
        } else {
          setError(json.error);
        }
      } else {
        setError("User must be logged in!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, user]);
  return { error, isLoading, fetchOrders };
};

export const useAddOrder = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useOrderContext();
  const { setCart } = useCartContext();
  const { user } = useAuthContext();
  const addOrder = async (
    email,
    name,
    phone,
    status,
    shipping_address,
    tip_amount,
    additional_info,
    products
  ) => {
    try {
      setIsLoading(true);
      if (user) {
        const addResponse = await fetch("/api/user/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            email,
            name,
            phone,
            status,
            shipping_address,
            tip_amount,
            additional_info,
            products,
          }),
        });
        const clearCartResponse = await fetch("/api/user/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await addResponse.json();
        if (addResponse.ok && clearCartResponse.ok) {
          dispatch({ type: "ADD_ORDER", payload: json });
          setCart([]);
        } else {
          setError(json.error);
        }
      } else {
        setError("User must be logged in!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { addOrder, error, isLoading };
};

export const useUpdateOrder = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useOrderContext();
  const { user } = useAuthContext();
  const updateOrder = async (orderId, orderData) => {
    try {
      setIsLoading(true);
      if (user) {
        const response = await fetch(`/api/user/order/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(orderData),
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: "UPDATE_ORDER", payload: json });
        } else {
          setError(json.error);
        }
      } else {
        setError("User must be logged in!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { updateOrder, error, isLoading };
};

export const useDeleteOrder = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useOrderContext();
  const { user } = useAuthContext();
  const deleteOrder = useCallback(
    async (orderId) => {
      try {
        setIsLoading(true);
        if (user) {
          const response = await fetch(`/api/user/order/${orderId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          });
          const json = await response.json();
          if (response.ok) {
            dispatch({ type: "DELETE_ORDER", payload: orderId });
          } else {
            setError(json.error);
          }
        } else {
          setError("User must be logged in!");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, user]
  );
  return { deleteOrder, error, isLoading };
};
