import React from 'react';
// import './NextButton.css';

const NextButton = ({ handleNext, isLastQuestion }) => {
    return (
        <div className='next-button-container'>
            <button className='next-button' onClick={handleNext}>
                {isLastQuestion ? 'Submit' : 'Next'}
            </button>
        </div>
    );
};

export default NextButton;
