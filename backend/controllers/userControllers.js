const expressAsyncHandler = require("express-async-handler");
const genToken = require("../config/genToken");
const User = require("../models/userModel");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the felids");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.name,
      pic: user.pic,
      token: genToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Fail to create user");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.name,
      pic: user.pic,
      token: genToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Fail to create user");
  }
});

module.exports = { registerUser, authUser };
