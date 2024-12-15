const catchAsyncError = require("../middleware/catchAsyncError");
const Quiz = require("../models/Quiz"); // Import the Order model
const Question = require("../models/Question");
const ErrorHandler = require("../utilis/errorhandler");
const { default: mongoose } = require("mongoose");
const Submission = require("../models/Submission");

const getQuizStatistics = async (quizId) => {
  try {
    // Find all questions for the specified quiz
    const questions = await Question.find({ quiz: quizId });

    // Define an aggregation pipeline to count the number of users who attended each question and got them correct or wrong
    const pipeline = [
      // Match submissions for the specified quiz
      { $match: { quiz_id: quizId } },

      // Group by question_id and is_correct, counting the number of occurrences
      {
        $group: {
          _id: { question_id: "$question_id", is_correct: "$is_correct" },
          count: { $sum: 1 },
        },
      },
      // Project to reshape the output
      {
        $project: {
          _id: 0,
          question_id: "$_id.question_id",
          is_correct: "$_id.is_correct",
          count: 1,
        },
      },
    ];

    console.log(questions);

    // Execute the aggregation pipeline
    const results = await Submission.aggregate(pipeline);

    // Prepare the response data
    const quizStatistics = questions.map((question) => {
      const attended = results
        .filter((result) => result.question_id?.equals(question._id))
        .reduce(
          (total, { is_correct, count }) => {
            if (is_correct) {
              total.correct += count;
            } else {
              total.wrong += count;
            }
            total.total += count;
            return total;
          },
          { correct: 0, wrong: 0, total: 0 }
        );

      return {
        question_id: question._id,
        question_name: question.name,
        attended: attended.total || 0,
        correct: attended.correct || 0,
        wrong: attended.wrong || 0,
      };
    });

    return quizStatistics;
  } catch (error) {
    // console.log(error);
    throw new Error(error.message);
  }
};

const getPollResponses = async (quizId) => {
  try {
    // Find all questions of type 'poll' for the specified quiz
    const questions = await Question.find({
      quiz: quizId,
      // question_type: "poll",
    });

    console.log(questions);
    // Define an aggregation pipeline to count the number of users who selected each option for each question
    const pipeline = [
      // Match submissions for the specified quiz and questions
      {
        $match: {
          quiz_id: quizId,
          question_id: { $in: questions.map((q) => q._id) },
        },
      },
      // Group by question_id and selected_option, counting the number of occurrences
      {
        $group: {
          _id: {
            question_id: "$question_id",
            selected_option: "$selected_option",
          },
          count: { $sum: 1 },
        },
      },
      // Project to reshape the output
      {
        $project: {
          _id: 0,
          question_id: "$_id.question_id",
          selected_option: "$_id.selected_option",
          count: 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const results = await Submission.aggregate(pipeline);

    // Prepare the response data
    const pollResponses = questions.map((question) => {
      const responses = results.filter((result) =>
        result.question_id.equals(question._id)
      );
      return {
        question_id: question._id,
        question_name: question.name,
        options: question.options.map((option, index) => ({
          option_index: index + 1,
          option_title: option.title,
          option_image: option.image,
          count:
            responses.find((response) => response.selected_option == index)
              ?.count || 0,
        })),
      };
    });

    return pollResponses;
  } catch (error) {
    throw new Error(error.message);
  }
};

// function That will get Take the Order_id and Order_list Data->{array} and will contain Create multiple Entries into OrderList Schema
const CreateQuestions = async (quizId, questionList) => {
  try {
    const createdQuestionList = []; // Array to store created questions
    for (const question of questionList) {
      // Create a new question
      const questionSchema = new Question({
        name: question.name,
        quiz: new mongoose.Types.ObjectId(quizId),
        timer: question.timer || null,
        question_type: question.question_type,
        options: question.options,
        correctOption: question.correctOption,
      });

      const savedQuestion = await questionSchema.save();
      createdQuestionList.push(savedQuestion); // Add the created question to the array
    }
    return createdQuestionList; // Return the array of created questions
  } catch (err) {
    throw new Error(
      "Error while creating or updating question list: " + err.message
    );
  }
};

exports.createQuiz = catchAsyncError(async (req, res, next) => {
  let { quiz_name, quiz_type, Questions } = req.body;
  Questions = JSON.parse(Questions);

  try {
    if (!quiz_name || !quiz_type || !Questions) {
      return next(new ErrorHandler("All Fields are required", 400));
    }

    const user_id = req.userId;

    const newQuiz = new Quiz({
      quiz_name,
      quiz_type,
      user_id,
    });

    const QuizData = await newQuiz.save();
    const QuestionList = await CreateQuestions(QuizData._id, Questions);

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: { QuizData, QuestionList },
    });
  } catch (error) {
    return next(new ErrorHandler(`Error creating quiz: ${error.message}`, 400));
  }
});



exports.getAllQuiz = async (req, res, next) => {
  const userId = req.userId; // Assuming userId is available in req.userId

  try {
    // Find all quizzes related to the user
    const quizzes = await Quiz.find({ user_id: userId, is_deleted: false });

    // Prepare an array to store quiz statistics
    const quizStatistics = [];

    // Iterate over each quiz

    for (const quiz of quizzes) {
      console.log(quiz.quiz_type);

      const quizData = {
        quiz_id: quiz._id,
        quiz_name: quiz.quiz_name,
        quiz_type: quiz.quiz_type,
        impression: quiz?.impression || 0,
        createdOn: quiz?.createdAt,
      };

      if (quiz.quiz_type == "Q&A") {
        quizData.quizStat = await getQuizStatistics(quiz._id);

        // quizStatistics.push(quizStat);
      }

      if (quiz.quiz_type == "poll") {
        quizData.quizStat = await getPollResponses(quiz._id);
      }

      quizStatistics.push(quizData);

      // Find all questions for the current quiz
      // const questions = await Question.find({ quiz: quiz._id });

      // Prepare an object to store statistics for the current quiz
      // const quizStat = {
      //   quiz_id: quiz._id,
      //   quiz_name: quiz.quiz_name,
      //   questions: [],
      // };

      // Iterate over each question
      // for (const question of questions) {
      //   // Define the pipeline based on the quiz type
      //   let pipeline = [];
      //   if (quiz.quiz_type === "poll") {
      //     pipeline = [
      //       { $match: { quiz_id: quiz._id, question_id: question._id } },
      //       { $group: { _id: "$selected_option", count: { $sum: 1 } } },
      //       { $project: { _id: 0, option: "$_id", count: 1 } },
      //     ];
      //   } else if (quiz.quiz_type === "Q&A") {
      //     pipeline = [
      //       {
      //         $match: {
      //           quiz_id: quiz._id,
      //           question_id: question._id,
      //           is_correct: true,
      //         },
      //       },
      //       { $group: { _id: null, count: { $sum: 1 } } },
      //       { $project: { _id: 0, count: 1 } },
      //     ];
      //   }

      //   // Execute the pipeline
      //   const result = await Submission.aggregate(pipeline);

      //   // Prepare the statistics for the current question
      //   const questionStat = {
      //     question_id: question._id,
      //     question_name: question.name,
      //     statistics: result,
      //   };

      //   // Add the question statistics to the quiz statistics
      //   quizStat.questions.push(questionStat);
      // }

      // Add the quiz statistics to the final array
      // quizStatistics.push(quizStat);
    }

    res.status(200).json({
      success: true,
      data: quizStatistics,
    });
  } catch (error) {
    next(error);
  }
};

exports.dashboard = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.userId;

    // Fetch all quizzes by userId
    const quizzes = await Quiz.find({ user_id: userId, is_deleted: false });

    // Calculate total impression and total quiz count
    let totalImpressions = 0;
    let totalQuestions = 0;
    const totalQuizzes = quizzes.length;

    console.log(quizzes);

    // Iterate through each quiz
    await Promise.all(
      quizzes.map(async (quiz) => {
        // Fetch questions for the current quiz
        const questions = await Question.find({ quiz: quiz._id });

        // Increment total question count
        totalQuestions += questions.length;

        // Add questions to quiz object
        quiz.questions = questions;

        // Increment total impressions
        totalImpressions += quiz.impression;
      })
    );

    // Sort quizzes by impression count
    quizzes.sort((a, b) => b.impression - a.impression);

    // Return the first 12 quizzes
    const twelveQuizzes = quizzes.slice(0, 12);

    res.json({
      success: true,
      data: twelveQuizzes,
      totalImpressions,
      totalQuestions,
      totalQuizzes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

exports.getQuizById = async (req, res, next) => {
  const quizId = req.params.id; // Extract order ID from request parameters

  try {
    // Build the aggregation pipeline
    let pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(quizId),
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: "questions", // Name of the collection to join
          localField: "_id", // Field from the Quiz collection
          foreignField: "quiz", // Field from the Question collection
          as: "questions", // Alias for the joined collection
        },
      },
    ];

    // Execute the aggregation pipeline

    console.log("Pipeline is this", JSON.stringify(pipeline));

    const orders = await Quiz.aggregate([...pipeline]);

    // Get total count for pagination

    return res.status(200).json({
      success: true,
      message: "Quiz fetched successfully",
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    console.log("deleteQuiz deleteQuizdeleteQuiz");
    const quizId = req.params.id;
    const IsExistQuiz = await Quiz.findById(quizId);
    if (!IsExistQuiz) return next(new ErrorHandler("Quiz not found", 400));

    const deleteQuiz = await Quiz.findByIdAndUpdate(quizId, {
      is_deleted: true,
    });

    if (!deleteQuiz) {
      return res.status(500).json({
        success: true,
        message: "Something Went Wrong While Deleting Quiz",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz Deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

exports.addImpression = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return next(new ErrorHandler(`Couldn't find Quiz with id ${id}`));
  }

  quiz.impression += 1;
  await quiz.save();

  res.status(200).json({
    success: true,
    message: "Impression added successfully",
    data: quiz,
  });
});
