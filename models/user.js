const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender");
        }
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please Enter Strong Password");
        }
      },
    },
  },
  { timestamps: true }
);

dbSchema.methods.signJWT = async function () {
  const user = this;

  const token = await jwt.sign({ id: user.id }, "MysecretToken789", {
    expiresIn: "1h",
  });

  return token;
};

dbSchema.methods.verifyPWD = async function (password) {
  const user = this;
  const validPassword = await bcrypt.compare(password, user.password);

  return validPassword;
};

const UserModel = mongoose.model("User", dbSchema);

module.exports = {
  UserModel,
};
