import { useEffect, useState } from "react";
import {
  useDeleteOrder,
  useFetchOrders,
  useOrderContext,
} from "../hooks/useOrderContext";
import ClipLoader from "react-spinners/ClipLoader";
import OrderItem from "../components/OrderItem";
import "../styles/Orders.css";
import Toast from "../components/Toast";

export default function Orders() {
  const {
    error: fetchError,
    isLoading: isFetching,
    fetchOrders,
  } = useFetchOrders();
  const {
    error: deleteError,
    isLoading: isDeleting,
    deleteOrder,
  } = useDeleteOrder();
  const { orders } = useOrderContext();
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });
  useEffect(() => {
    const getAllOrders = async () => {
      await fetchOrders();
    };
    getAllOrders();
  }, [fetchOrders]);
  useEffect(() => {
    if (fetchError) {
      setToast({
        message: fetchError,
        isVisible: true,
        isError: true,
      });
    }
    if (deleteError) {
      setToast({
        message: deleteError,
        isVisible: true,
        isError: true,
      });
    }
  }, [fetchError, deleteError]);

  return (
    <>
      {isFetching || isDeleting ? (
        <ClipLoader
          loading={isDeleting || isFetching}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : orders && orders.length > 0 ? (
        <div className="orders-page">
          {orders &&
            orders.map((order) => (
              <OrderItem
                key={order._id}
                order={order}
                onDelete={deleteOrder}
                isDeleting={isDeleting}
              />
            ))}
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
        <h1>You have no orders yet!</h1>
      )}
    </>
  );
}
