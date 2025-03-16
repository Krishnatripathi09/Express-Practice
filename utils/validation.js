const validator = require("validator");

const validateSignUpData = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please Enter Valid First and Last Name");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First Name should be between 4 to 50 Characters");
  } else if (lastName.length < 4 || lastName.length > 30) {
    throw new Error("Last Name should be between 4 to 30 charcters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter valid Email");
  } else if (!password) {
    throw new Error("Please Enter Password");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};

module.exports = {
  validateSignUpData,
};
