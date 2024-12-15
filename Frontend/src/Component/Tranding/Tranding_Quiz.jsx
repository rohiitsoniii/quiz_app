import React from 'react';
import "./Tranding_Quiz.css";
import { formatDate } from '../../utilis/dateConverter';

const Tranding_Quiz = ({ quizzes }) => {

  console.log("ajay", quizzes);

 

  return (
    <>
      <div className='ajay'>


        <p className='tranding_quiz'>Trending Quizzes</p>
        <div className='grid_quiz'>
          {quizzes.map(quiz => (
            <div className='main_quizdiv' key={quiz.
              user_id
              }>
              <div className='allQuiz_div'>
                <p className='Quiz_text'>{quiz.quiz_name}</p>
                <p className='quiz_numeric'>
                  {quiz.impression} <span><img src="./eye.svg" alt="views" /></span>
                </p>
              </div>
              <p className='created_date'>Created on: {formatDate(quiz.updatedAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tranding_Quiz;
