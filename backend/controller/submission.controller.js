const catchAsyncError = require("../middleware/catchAsyncError");
const Question = require("../models/Question");
const Submission = require("../models/Submission");
const ErrorHandler = require("../utilis/errorhandler");

exports.submitAnswer = catchAsyncError(async (req, res, next) => {

  const { quizId, questionId, selectedOption } = req.body;

  // Fetch the question to validate the answer
  const question = await Question.findById(questionId);
  if (!question) {
    return next(
      new ErrorHandler(`Couldn't find question with id ${questionId}`, 404)
    );
  }

  // Check if the selected option is correct
  const isCorrect = question.correctOption == selectedOption;

  // Create a new submission
  const submission = new Submission({
    quiz_id: quizId,
    question_id: questionId,
    selected_option: selectedOption,
    is_correct: isCorrect,
  });

  // Save the submission
  await submission.save();

  res.status(201).json({
    success: true,
    message: "Submission saved successfully",
    data: submission,
  });
});


