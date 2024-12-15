import React from "react";
// import "./Option.css";

const Option = ({ option, isSelected, onClick }) => {
  return (
    <div className={`option ${isSelected ? "selected" : ""}`} onClick={onClick}>
      {option.title && (
        <p className="option-text">{option.title}</p>
      )}
      {option.image && (
        <img src={option.image} alt="option" className="option_image" />
      )}
    </div>
  );
};

export default Option;
