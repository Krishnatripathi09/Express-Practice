const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Session Not Valid !! Please Log-In Again");
    }
    const decodedMSG = await jwt.verify(token, "MysecretToken789");

    const { id } = decodedMSG;

    const user = await UserModel.findById(id).select(
      "firstName lastName email"
    );
    if (!user) {
      throw new Error("User Not Found !!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error Occured :" + err.message);
  }
};

module.exports = {
  userAuth,
};
