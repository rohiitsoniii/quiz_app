const Submission=require('../models/Submission')


exports.dashBoard = async (req, res, next) => {
  try {
    const { quiz_id, submissions } = req.body;

    const pipeline=[
        {
          $match:
            {
              user_id: new mongoose.Schema.Types.ObjectId(req.user_id)
            },
        },
        {
          $lookup: {
            from: "questions",
            localField: "_id",
            foreignField: "quiz",
            as: "result",
          },
        },
        {
          $group: {
            _id: null,
            fieldN: {
              $sum: 1,
            },
            field: {
              $sum: {
                $size: "$result",
              },
            },
          },
        },
      ]

      

    res.status(200).json({
      success: true,
      message: "Submissions added successfully",
      data: data,
    });
  } catch (error) {
    return next(error);
  }
};