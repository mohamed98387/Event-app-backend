const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = function (req, res, next) {
  // get Token from the header
  const token = req.header("x-auth-token");
  // chek if token exists
  if (!token) {
    return res.json({ msg: "No Token,acess denied !" });
  }
  jwt.verify(token, keys.secretOrKey, (err, decoded) => {
    if (err) res.json({ msg: "token not valid" });

    req.user = decoded.user;
    next();
  });
};
