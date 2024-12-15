import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionHeader from "../../Component/QuizQuestionsComponent/QuestionHeader/index";
import QuestionText from "../../Component/QuizQuestionsComponent/QuestionText/index";
import OptionsContainer from "../../Component/QuizQuestionsComponent/OptionsContainer/index";
import NextButton from "../../Component/QuizQuestionsComponent/NextButton/index";
import "./QuizQuestionsContainer.css";
import { fetchGetData, patchData, postData } from "../../api";
import Wining from "../../Component/Wining/Wining";
import Poll from "../../Component/Poll/Poll";

const QuizContainer = () => {
  const { id } = useParams(); // Get the quiz ID from the URL params
  const [quizDetail, setQuizDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizType, setQuizType] = useState("");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizDetail = await fetchGetData(`/quiz/${id}`);
        setQuizDetail(quizDetail.data);
        setQuestions(quizDetail.data[0].questions); // Assuming questions are part of quizDetail.data
        setQuizType(quizDetail.data[0].quiz_type); //
        setLoading(false);
        toast.success("Quiz data loaded successfully!");

        //increase impression
        patchData(`/quiz/${id}`);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to load quiz data.");
      }
    };
    fetchQuizData();
  }, []);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    console.log(currentQuestion);
    if (currentQuestion?.timer) {
      setTimer(currentQuestion.timer);
    } else {
      setTimer(null);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    let countdown;
    if (timer !== null && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleNext();
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const handleNext = () => {
    postData("submission/create", {
      quizId: id,
      questionId: questions[currentQuestionIndex]._id,
      selectedOption: selectedOption,
    });

    if (selectedOption !== null) {
      if (selectedOption === questions[currentQuestionIndex].correctOption) {
        setScore(score + 1);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setAllQuestionsAnswered(true);
    }
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (questions.length === 0) {
    return <div className="no-questions">No questions available.</div>;
  }

  if (allQuestionsAnswered) {
    return quizType === "poll" ? (
      <Poll />
    ) : (
      <Wining score={score} totalQuestions={questions.length} />
    );

    // <div className="results">All questions answered. Thank you!{score}</div>
  }

  const { name, options } = questions[currentQuestionIndex] || {};

  return (
    <div className="quiz-container">
      <div className="sub-container">
        <QuestionHeader
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          timer={timer}
        />
        <QuestionText text={name} />
        <OptionsContainer
          options={options}
          selectedOption={selectedOption}
          handleOptionClick={handleOptionClick}
        />
        <NextButton
          handleNext={handleNext}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>
    </div>
  );
};

export default QuizContainer;
