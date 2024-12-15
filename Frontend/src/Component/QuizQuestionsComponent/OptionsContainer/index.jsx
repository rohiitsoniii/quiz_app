import React from "react";
import Option from "../Options/index";
// import './OptionsContainer.css';

const OptionsContainer = ({ options, selectedOption, handleOptionClick }) => {
  if (!options || options.length == 0) {
    return <div className="no-options">No options available.</div>;
  }

  return (
    <div className="all_options">
      {options.map((option, index) => (
        <Option
          key={index}
          option={option}
          isSelected={selectedOption === index}
          onClick={() => handleOptionClick(index)}
        />
      ))}
    </div>
  );
};

export default OptionsContainer;
