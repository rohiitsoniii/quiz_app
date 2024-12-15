const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utilis/errorhandler");

exports.Login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(200).json({
      success: false,
      message: "All field are required",
    });
  }

  const user = await User.find({ email: email });

  console.log(user);

  if (!user || user.length === 0) {
    return next(new ErrorHandler("Email or password is not valid", 400));
  }

  console.log(user[0].password, "_______", password, "This is user ");

  const isMatch = await bcrypt.compare(password, user[0].password);

  if (!isMatch) {
    return next(new ErrorHandler("Email or password is not valid", 400));
    // GenerateJWT Token
  }

  const token = jwt.sign(
    { userID: user[0]._id, AccessRole: user[0].permissions },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "5d",
    }
  );

  //res.send({"status": "success","message":"LOGIN sucessful","token": token})
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    token: token,
    data: user,
  });
});

exports.Register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required" });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return next(new ErrorHandler("User Already Exits", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User Register successfully",
      data: newUser,
    });
  } catch (error) {
    return next(new ErrorHandler(`Error creating user: ${error.message}`, 400));
  }
});



