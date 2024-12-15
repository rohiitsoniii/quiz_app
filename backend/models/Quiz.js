const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    quiz_name: {
      type: String,
      required: true,
    },
    quiz_type: {
      type: String,
      enum: ["Q&A", "poll"],
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default:false
    },
    impression: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
