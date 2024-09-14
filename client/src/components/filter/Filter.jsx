/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { featuredCard, ratingCategories } from "../../components/card/Card";
import "./filter.css";

const Filter = ({
  selectedCategory,
  setSelectedCategory,
  selectedRating,
  setSelectedRating,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const toggleMenu = () => {
    setIsFilterOpen((prevState) => !prevState);
  };

  const clearFilter = () => {
    setSelectedCategory("");
    setSelectedRating("");
  };

  return (
    <div className="filterSection">
      <div className="filterHeader">
        <h4>Filter</h4>
        <div className="FilterArrow">
          <button onClick={clearFilter}>clear all</button>
          <div className="filterArrowIcons">
            {isFilterOpen ? (
              <IoIosArrowUp className="icon" onClick={toggleMenu} />
            ) : (
              <IoIosArrowDown className="icon" onClick={toggleMenu} />
            )}
          </div>
        </div>
      </div>
      <div className={isFilterOpen ? "active" : "notActive"}>
        <div className="filterBox">
          <div
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="filterTitle"
          >
            <p>Category</p>
            {isCategoryOpen ? (
              <IoIosArrowUp className="icon" />
            ) : (
              <IoIosArrowDown className="icon" />
            )}
          </div>
          <div
            className="filterList"
            style={{ display: isCategoryOpen ? "block" : "none" }}
          >
            {featuredCard.map((category, index) => (
              <div key={index} className="filterLabel">
                <input
                  type="radio"
                  name="Categories"
                  id={category.name}
                  checked={selectedCategory === category.name}
                  onChange={() => setSelectedCategory(category.name)}
                />
                <label htmlFor={category.name}>{category.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="filterBox">
          <div
            onClick={() => setIsRatingOpen(!isRatingOpen)}
            className="filterTitle"
          >
            <p>Rating</p>
            {isRatingOpen ? (
              <IoIosArrowUp className="icon" />
            ) : (
              <IoIosArrowDown className="icon" />
            )}
          </div>
          <div style={{ display: isRatingOpen ? "block" : "none" }}>
            {ratingCategories.map((rating, index) => (
              <div key={index} className="filterLabel">
                <input
                  type="radio"
                  name="Rating"
                  id={rating.id}
                  checked={selectedRating === rating.id}
                  onChange={() => setSelectedRating(rating.id)}
                />
                <label htmlFor={rating.id}>{rating.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
