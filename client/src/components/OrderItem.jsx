import { useState } from "react";
import Modal from "./Modal"; // Adjust the path as necessary
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from "prop-types";

export default function OrderItem({ order, onDelete, isDeleting }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(order._id);
    setIsModalOpen(false);
  };

  return (
    <div className="order-item">
      <div className="order-item-header">
        <h2>{order.status}</h2>
        <h2>Item(s)</h2>
        <h2>Total: $ {order.total_amount.toFixed(2)}</h2>
      </div>
      <div className="order-item-body">
        <div className="order-item-address">
          <div>
            <p>Ship to: {order.shipping_address}</p>
            <p>Name: {order.name}</p>
            <p>Email: {order.email}</p>
            <p>Phone: {order.phone}</p>
          </div>
          <button onClick={handleDeleteClick} disabled={isDeleting}>
            {isDeleting ? (
              <ClipLoader
                loading={isDeleting}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Cancel Order"
            )}
          </button>
        </div>
        <div className="order-item-food">
          {order.products.map((p) => (
            <div key={p._id} className="order-item-food-item">
              <h3>{p.quantity + " x "}</h3>
              <section>
                <img
                  src={`../images/${p.food.image}`}
                  alt=""
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "../images/no-image.jpg";
                  }}
                />
                <div className="food-items-desc">
                  <h4>{p.food.name}</h4>
                  <p>{p.food.description}</p>
                  <h4>${p.food.price.final}</h4>
                </div>
              </section>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Do you really want to cancel this order?"
      />
    </div>
  );
}

OrderItem.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    total_amount: PropTypes.number.isRequired,
    shipping_address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        food: PropTypes.shape({
          image: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          price: PropTypes.shape({ final: PropTypes.number.isRequired })
            .isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
};
