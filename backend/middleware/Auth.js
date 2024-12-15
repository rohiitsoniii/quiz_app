const User = require("../models/User");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utilis/errorhandler");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedData) => {
      if (err) {
        return next(new ErrorHandler("Invalid token", 401));
      } else {
        const UserData = await User.findById(decodedData.userID);

        if (!UserData) {
          return next(new ErrorHandler("You are not a Valid User ", 400));
        }

        req.user = UserData;
        req.userId = UserData._id;

        next();
      }
    });
  } else {
    return next(
      new ErrorHandler(
        "PLease login to access this resouces . Invalid token",
        401
      )
    );
  }
});
