//const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const tokenAuth = (req, res, next) => {
  const token = req.cookies.token_auth;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Dostęp zabroniony. Wymagane zalogowanie." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Dostęp zabroniony. Wymagane zalogowanie." });
    }

    req.user = decoded;
    next();
  });
};

module.exports = tokenAuth;
