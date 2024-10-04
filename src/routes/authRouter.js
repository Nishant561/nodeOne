const express = require("express");
const { User } = require("./../config/schema/userModel");
const bcrypt = require("bcrypt");
const authUser = require("./../middleware/authUser");
const authRouter = express.Router();
const { sendEmail } = require("./../utils/sendemail");
const updateValidate = require("./../utils/updateValidate");
const jwt = require("jsonwebtoken");
authRouter.post("/signup", async (request, response, next) => {
  try {
    const { firstName, email, password, skills, age } = request.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = await User.create({
      firstName,
      email,
      skills,
      age,
      password: passwordHash,
    });
    await user.save();
    return response.status(200).json({
      status: "Success",
      message: "User created successfully.",
    });
  } catch (error) {
    return response.status(404).json({
      status: "fail",
      message: "something went wrong" + error.message,
    });
  }
});

authRouter.post("/login", authUser.login, async (request, response) => {
  try {
    const { firstName } = request.user;

    return response.status(200).json({
      status: "success",
      name: firstName,
      message: "Logged In successfully",
    });
  } catch (error) {
    return response.status(400).json({
      status: "fail",
      message: "something went wrong." + error.message,
    });
  }
});

authRouter.post("/logout", async (request, response) => {
  return response
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      status: "success",
      message: "logged Out successfully",
    });
});

authRouter.post("/forgotpassword", async (request, response) => {
  try {
    const { email } = request.body;
    const isVlaidEmail = await updateValidate.emailValidate(email);

    if (!isVlaidEmail) {
      throw new Error("Email is not valid.");
    }

    if (!email) {
      throw new Error("To continue Please Provide your email.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User with this email dosent found.");
    }
    const resetConfiguration = {
      URL: `127.0.0.1:8000/resetpassword/${user._id}`,
      to: user.email,
    };
    await sendEmail(resetConfiguration);
    const resetToken = await jwt.sign({ _id: user._id }, "nishant123", {
      expiresIn: "10m",
    });
    response.cookie("resetToken", resetToken, {
      expires: new Date(Date.now() + 1000000),
    });

    return response.status(200).json({
      status: "success",
      message: "Password reset link send.",
    });
  } catch (error) {
    return response.status(404).json({
      status: "success",
      message: "Error:: " + error.message,
    });
  }
});

authRouter.post("/resetpassword/:userId", async (request, response) => {
  try {
    const { password } = request.body;
    const { userId } = request.params;
    const { resetToken } = request.cookies;
    const verifyToken = await jwt.verify(resetToken, "nishant123");

    if (!resetToken || !verifyToken) {
      throw new Error("Token is invalid");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User cant be found.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;

    await user.save();

    response.cookie("resetToken", null, {
      expires: new Date(Date.now()),
    });

    return response.status(200).json({
      status: "success",

      message: `${user.firstName} you successfully changed your password.`,
    });
  } catch (error) {
    return response.status(404).json({
      status: "fail",
      message: "Error:: " + error.message,
    });
  }
});

module.exports = { authRouter };
