const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
});

const QuestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  timer: {
    type: Number,
    default: null,
  },
  question_type: {
    type: String,
    enum: ["text", "image", "text and image"],
    required: true,
  },
  options: [OptionSchema],
  correctOption: {
    type: Number,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
