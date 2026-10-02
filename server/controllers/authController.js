const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signToken = (id) => {
 return jwt.sign({ id }, process.env.JWT_SECRET, {
 expiresIn: process.env.JWT_EXPIRE,
 });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

exports.registerUser = async (req, res, next) => {
 try {
 const { name, email, password } = req.body;
 const user = await User.create({ name, email, password });
 createSendToken(user, 201, res);
 } catch (err) {
 // Handle duplicate email error
 if (err.code === 11000) {
 const error = new Error("Email already exists");
 error.statusCode = 400;
 return next(error);
 }
 // Handle validation errors
 if (err.name === "ValidationError") {
 const error = new Error("Invalid input data");
 error.statusCode = 400;
 return next(error);
 }
 next(err);
 }
};

exports.loginUser = async (req, res, next) => {
 try {
 const { email, password } = req.body;
 if (!email || !password) {
 const error = new Error("Please provide email and password");
 error.statusCode = 400;
 return next(error);
 }
 const user = await User.findOne({ email }).select("+password");
 if (!user) {
 const error = new Error("Invalid credentials");
 error.statusCode = 401;
 return next(error);
 }
 const isCorrect = await user.correctPassword(password, user.password);
 if (!isCorrect) {
 const error = new Error("Invalid credentials");
 error.statusCode = 401;
 return next(error);
 }
 createSendToken(user, 200, res);
 } catch (err) {
 next(err);
 }
};

exports.getCurrentUser = (req, res) => {
 res.status(200).json({
 success: true,
 data: {
 user: req.user,
 },
 });
};