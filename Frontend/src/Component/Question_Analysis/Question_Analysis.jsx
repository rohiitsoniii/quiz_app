import React from "react";
import "./Question_Analysis.css";
import { formatDate } from "../../utilis/dateConverter";

const Question_Analysis = ({ selectedQuiz }) => {
  const quizType = selectedQuiz.quiz_type;
  return (
    <div className="questionAnalysisWidth">
      <div className="background_color">
        <div className="quiz_2_questions">
          <p className="quiz_Questions_heading">
            {selectedQuiz.quiz_name} Question Analysis
          </p>
          <div className="quiz_2_created">
            <p className="imp">
              Created on: {formatDate(selectedQuiz.createdOn)}
            </p>
            <p className="imp1">Impressions: {selectedQuiz.impression}</p>
          </div>
        </div>
        <div className="questions_quiz_2">
          {selectedQuiz.quizStat?.map((questionData, index) => (
            <div key={index} className="question_block">
              <p className="all_questions">
                {`Q${index + 1} `}
                {questionData.question_name}
              </p>
              {quizType === "Q&A" ? (
                <div className="answers">
                  <div className="first_question">
                    <p className="attempted">{questionData.attended}</p>
                    <p className="people_attempt">
                      people Attempted the question
                    </p>
                  </div>
                  <div className="first_question">
                    <p className="attempted">{questionData.correct}</p>
                    <p className="people_attempt">people Answered Correctly</p>
                  </div>
                  <div className="first_question">
                    <p className="attempted">{questionData.wrong}</p>
                    <p className="people_attempt">
                      people Answered Incorrectly
                    </p>
                  </div>
                </div>
              ) : (
                <div className="answers">
                  {questionData.options.map((option, optIndex) => (
                    <div key={optIndex} className="pollQuestion">
                      <p className="attempted">{option.count}</p>
                      <p className="people_attempt">{option.option_title}</p>
                      {option?.option_image && (
                        <img
                          src={option.option_image}
                          alt="option"
                          style={{ height: "100px" }}
                        />
                      )}{" "}
                    </div>
                  ))}
                </div>
              )}
              <br />
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question_Analysis;
