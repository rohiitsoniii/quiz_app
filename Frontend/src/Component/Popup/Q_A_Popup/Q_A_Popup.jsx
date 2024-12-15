import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Q_A_Popup.css";
import Congrets from "../Congrets/Congrets";
import { postData } from "../../../api";

const Q_A_Popup = ({ onClose, isQA, quiz_name }) => {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [questions, setQuestions] = useState([
    {
      name: "",
      question_type: "text",
      options: [{ title: "" }, { title: "" }],
      correctOption: null,
      timer: null,
    },
  ]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addQuestion = () => {
    if (questions.length < 5) {
      const newQuestion = {
        name: "",
        question_type: "text",
        options: [{ title: "" }, { title: "" }],
        correctOption: null,
        timer: null,
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    if (selectedQuestionIndex >= index) {
      setSelectedQuestionIndex(Math.max(selectedQuestionIndex - 1, 0));
    }
  };

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);
  const handleTimerClick = (questionIndex, seconds) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].timer = seconds;
    setQuestions(updatedQuestions);
  };
  const updateQuestionField = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (index) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[index].options.length < 4) {
      const newOption =
        updatedQuestions[index].question_type === "text"
          ? { title: "" }
          : updatedQuestions[index].question_type === "image"
          ? { image: "" }
          : { title: "", image: "" };
      updatedQuestions[index].options.push(newOption);
      setQuestions(updatedQuestions);
    }
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const setCorrectOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    const errors = [];
    questions.forEach((question, index) => {
      if (!question.name) {
        errors.push({ index, field: "name", message: "Question is required." });
      }
      if (
        question.question_type === "text" &&
        question.options.some((option) => !option.title)
      ) {
        errors.push({
          index,
          field: "options",
          message: "All options are required.",
        });
      }
      if (
        question.question_type === "image" &&
        question.options.some((option) => !option.image)
      ) {
        errors.push({
          index,
          field: "options",
          message: "All options are required.",
        });
      }
      if (
        question.question_type === "text and image" &&
        question.options.some((option) => !option.title || !option.image)
      ) {
        errors.push({
          index,
          field: "options",
          message: "All options are required.",
        });
      }
      if (isQA && question.correctOption === null) {
        errors.push({
          index,
          field: "correctOption",
          message: "Correct option is required.",
        });
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCreateQuiz = async () => {
    if (validateQuestions()) {
      // Show loader
      setIsLoading(true);

      try {
        // Call the API to create the quiz
        const createQuizData = {
          quiz_name: quiz_name,
          quiz_type: isQA ? "Q&A" : "poll",
          Questions: JSON.stringify(questions),
        };

        const token = localStorage.getItem("token");

        // Call postData function with token
        const newQuiz = await postData("/quiz/create", createQuizData, token);

        const link = `${"https://cuvvet-final-evalution-october.vercel.app"}/#/quiz/${
          newQuiz.data.QuizData._id
        }`;

        setShareLink(link);

        // Hide loader
        setIsLoading(false);

        // Show success toast
        toast.success(`${isQA ? "Q&A" : "poll"} created successfully!`);

        // Open congrats popup
        handleOpenPopup();
      } catch (error) {
        console.log("Error creating quiz:", error.message);

        // Hide loader
        setIsLoading(false);

        // Show error toast
        toast.error(error.message);
      }
    } else {
      const firstError = validationErrors[0];
      setSelectedQuestionIndex(firstError.index);
    }
  };

  const selectedQuestion = questions[selectedQuestionIndex];

  const renderOptions = (option, optionIndex) => {
    let placeholder =
      selectedQuestion.question_type === "image" ? "Image URL" : "Option";

    const error = validationErrors.find(
      (err) => err.index === selectedQuestionIndex && err.field === "options"
    );

    return (
      <div
        className={`options_one ${
          selectedQuestion.correctOption === optionIndex ? "Rohit" : ""
        }`}
        key={optionIndex}
      >
        {isQA && (
          <input
            type="radio"
            id={`option${optionIndex}`}
            name="correctOption"
            className="circle-checkbox"
            checked={selectedQuestion.correctOption === optionIndex}
            onChange={() =>
              setCorrectOption(selectedQuestionIndex, optionIndex)
            }
          />
        )}
        <label htmlFor={`option${optionIndex}`}>
          <span className="checkbox-circle"></span>
        </label>
        {selectedQuestion.question_type !== "image" && (
          <input
            type="text"
            value={option.title || ""}
            onChange={(e) =>
              handleOptionChange(
                selectedQuestionIndex,
                optionIndex,
                "title",
                e.target.value
              )
            }
            placeholder="Option Title"
            className={`option_input ${error ? "error" : ""}`}
          />
        )}
        {selectedQuestion.question_type !== "text" && (
          <input
            type="text"
            value={option.image || ""}
            onChange={(e) =>
              handleOptionChange(
                selectedQuestionIndex,
                optionIndex,
                "image",
                e.target.value
              )
            }
            placeholder="Image URL"
            className={`option_input ${error ? "error" : ""}`}
          />
        )}
        {optionIndex > 1 && (
          <button
            className="delete_icon"
            onClick={() => deleteOption(selectedQuestionIndex, optionIndex)}
          >
            <img src="./delete.svg" alt="Delete" />
          </button>
        )}
      </div>
    );
  };

  const renderError = (field) => {
    const error = validationErrors.find(
      (err) => err.index === selectedQuestionIndex && err.field === field
    );
    return error ? <div className="error_message">{error.message}</div> : null;
  };

  return (
    <div className="QA_popup">
      <ToastContainer />
      <div className="Qa_pop">
        <div className="add_btns_with_all_questions">
          <div className="all_circle_btns">
            {questions.map((question, index) => (
              <div
                key={index}
                className={`question_circle_btn ${
                  index === selectedQuestionIndex ? "selected" : ""
                }`}
                onClick={() => setSelectedQuestionIndex(index)}
              >
                <p className="circle_text">{index + 1}</p>
                {questions.length > 1 && (
                  <img
                    src="./cancle.svg"
                    alt="Delete"
                    className="cancel_icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(index);
                    }}
                  />
                )}
              </div>
            ))}
            {questions.length < 5 && (
              <p className="add_more_btn" onClick={addQuestion}>
                +
              </p>
            )}
          </div>
          <p className="Qa_total_questions">Max 5 questions</p>
        </div>
        <input
          type="text"
          value={selectedQuestion.name}
          onChange={(e) =>
            updateQuestionField(selectedQuestionIndex, "name", e.target.value)
          }
          placeholder={isQA ? "QA Question" : "Poll Question"}
          className={`Q_A_input ${
            validationErrors.find(
              (err) =>
                err.index === selectedQuestionIndex && err.field === "name"
            )
              ? "error"
              : ""
          }`}
        />
        {renderError("name")}
        <div className="choose_option_type">
          <p className="option_text">Option Type</p>
          {["text", "image", "text and image"].map((type) => (
            <React.Fragment key={type}>
              <input
                type="radio"
                id={`${type}Option`}
                name="question_type"
                checked={selectedQuestion.question_type === type}
                className="circle-checkbox"
                onChange={() =>
                  updateQuestionField(
                    selectedQuestionIndex,
                    "question_type",
                    type
                  )
                }
              />
              <label htmlFor={`${type}Option`}>
                <span className="checkbox-circle"></span>
                <p className="option_text">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </p>
              </label>
            </React.Fragment>
          ))}
        </div>
        {isQA && renderError("correctOption")}
        {renderError("options")}

        <div className="options_qa">
          <div className="allOptions">
            {selectedQuestion.options.map(renderOptions)}
            {selectedQuestion.options.length < 4 && (
              <button
                className={`qa_creat_quiz_btn_cancel ${
                  isQA ? "addoption" : "addoptionset"
                }`}
                onClick={() => addOption(selectedQuestionIndex)}
              >
                Add Option
              </button>
            )}
          </div>
          {isQA && (
            <div className="time_qa">
              <p className="time_text_qa">Timer</p>
              <div className="timer_buttons_qa">
                {[null, 5, 10].map((time) => (
                  <button
                    key={time}
                    className={`timer_button_qa ${
                      selectedQuestion.timer === time ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleTimerClick(selectedQuestionIndex, time)
                    }
                  >
                    {time === null ? "Off" : `${time} sec`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="qa_creat_quiz_btn">
          <button className="qa_creat_quiz_btn_cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="qa_creat_quiz_btn_cancel qa_creat_quiz_btn_continoue"
            onClick={handleCreateQuiz}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Quiz"}
          </button>
        </div>
        {isPopupOpen && (
          <Congrets
            onClose={onClose}
            shareLink={shareLink}
            question_type={isQA ? "Q&A" : "poll"}
          />
        )}
      </div>
    </div>
  );
};

export default Q_A_Popup;
