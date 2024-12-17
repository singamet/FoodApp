import { useState, useEffect } from "react";
import "../styles/Slider.css";
import PropTypes from "prop-types";

const PriceFilter = ({ minPrice, maxPrice, onPriceChange }) => {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  useEffect(() => {
    onPriceChange({ min, max });
  }, [min, max, onPriceChange]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), max - 1);
    setMin(value);
  };
  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), min + 1);
    setMax(value);
  };

  return (
    <div className="price-filter">
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={min}
        onChange={handleMinChange}
        id="slider-left"
      />
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={max}
        onChange={handleMaxChange}
        id="slider-right"
      />
      <div className="slider-track"></div>
      <div className="price-values">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default PriceFilter;
PriceFilter.propTypes = {
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  onPriceChange: PropTypes.func.isRequired,
};
