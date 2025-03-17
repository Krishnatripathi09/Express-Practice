const express = require("express");
const { adminAuth, passwordAuth } = require("../middleware/auth");
const connectDB = require("../config/database");
const { UserModel } = require("../models/user");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const {
  validateSignUpData,
  validateEditProfileData,
} = require("../utils/validation");

const app = express();
app.use(express.json());
app.use(cookieparser());
const PORT = 3000;

connectDB()
  .then(() => {
    console.log("Connected to DataBase SuccessFully");
  })
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`Server is Running on  PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error Occured " + err);
  });

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const data = new UserModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await data.save();
    res.send("Data Saved SuccessFully");
  } catch (err) {
    res.status(400).send("Error Occured " + err);
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("User Not Found");
    }
    const isValidPassword = await user.verifyPWD(password);

    if (isValidPassword) {
      const token = await user.signJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      res.send("Login SuccessFull");
    } else {
      res.status(401).send("Please Enter Valid Password");
    }
  } catch (err) {
    res.status(400).send("Error Occured " + err);
  }
});

app.patch("/user/updatePassword", passwordAuth, async (req, res) => {
  const loggedInUser = req.user;
  const { oldPassword, newPassword } = req.body;

  const isValidPassword = await bcrypt.compare(
    oldPassword,
    loggedInUser.password
  );

  if (!isValidPassword) {
    res.status(401).send("Please Enter valid Old Password");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  loggedInUser.password = hashedPassword;

  await loggedInUser.save();

  res.status(200).send("Password Updated Successfully");
});

app.patch("/user/editProfile", userAuth, async (req, res) => {
  if (!validateEditProfileData(req)) {
    res.status(400).send("Edit Not Allowed on this Field");
  }

  const loggedInUser = req.user;

  Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

  await loggedInUser.save();

  res.json({ message: `${loggedInUser.firstName}`, data: loggedInUser });
});

app.get("/user", userAuth, async (req, res) => {
  const user = req.user;
  res.send("Logged-In User Is :" + user);
});
