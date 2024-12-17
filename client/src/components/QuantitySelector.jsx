import "../styles/QuantitySelector.css";
import PropTypes from "prop-types";

const QuantitySelector = ({ value, onChange, disabled }) => {
  return (
    <div className="quantity-selector">
      <div className="dropdown-container">
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
        >
          {[...Array(10).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <span className="dropdown-arrow">▼</span>
      </div>
    </div>
  );
};

export default QuantitySelector;
QuantitySelector.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
