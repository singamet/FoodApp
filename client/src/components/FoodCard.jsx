import { Link } from "react-router-dom";

import CustomButton from "./CustomButton";
import "../styles/FoodCard.css";
import PropTypes from "prop-types";

const FoodCard = ({ food }) => {
  const imgSrc = "../images/" + food.image;

  return (
    <div className="food-card">
      <div className="hover-links">
        <CustomButton
          isCart={false}
          foodId={food._id}
          quantity={0}
          isTooltip={true}
        />
        <CustomButton
          isCart={true}
          foodId={food._id}
          quantity={1}
          isTooltip={true}
        />
      </div>
      <Link to={"/dishes/" + food._id.toString()}>
        <img
          src={imgSrc}
          alt={food.name}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "../images/no-image.jpg";
          }}
        />
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <div className="price">
          <span>${food.price.final}</span>
          <span>${food.price.original}</span>
          <span>({food.price.offPercentage}% off)</span>
        </div>
      </Link>
    </div>
  );
};

export default FoodCard;
FoodCard.propTypes = {
  food: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.shape({
      final: PropTypes.number.isRequired,
      original: PropTypes.number.isRequired,
      offPercentage: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
