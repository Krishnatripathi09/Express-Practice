const express = require("express");
const { adminAuth } = require("../middleware/auth");
const connectDB = require("../config/database");
const { UserModel } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const app = express();
app.use(express.json());
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

    const data = await UserModel({
      firstName,
      lastName,
      email,
      password,
    });
    await data.save();
    res.send("Data Saved SuccessFully");
  } catch (err) {
    res.status(400).send("Error Occured " + err);
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.id;
  // const name = req.body.firstName;
  const user = await UserModel.findOneAndDelete(id);

  res.send("User Data Found " + user);
});
