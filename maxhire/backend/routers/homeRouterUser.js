const express = require("express");
const { UserRecord } = require("../records/UserRecord");
const tokenAuth = require("../guards/authGuard");

const homeRouterUser = express.Router();

homeRouterUser.get("/", tokenAuth, async (req, res) => {
  const data = await UserRecord.findAll();
  res.status(200).json(data);
});

module.exports = {
  homeRouterUser,
};
