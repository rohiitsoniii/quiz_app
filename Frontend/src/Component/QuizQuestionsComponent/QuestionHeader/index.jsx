import React from 'react';
// import './QuestionHeader.css';

const QuestionHeader = ({ currentQuestionIndex, totalQuestions, timer }) => {
    return (
        <div className='time_question'>
            <p className='total_ques'>0{currentQuestionIndex + 1}/0{totalQuestions}</p>
            {timer !== null && <p className='timer'>{`00:${timer < 10 ? '0' + timer : timer}s`}</p>}
        </div>
    );
};

export default QuestionHeader;
