const express = require("express");
const tokenAuth = require("../guards/authGuard");
const { ValidationError } = require("../utils/handleErrors");
const { UserRecord } = require("../records/UserRecord");

const profileRouter = express.Router();

profileRouter.get("/getProfile/:id", tokenAuth, async (req, res) => {
  const data = await UserRecord.getOneUser(req.params.id);
  if (!data) {
    throw new ValidationError("Profil nie istnieje!");
  }
  res.status(200).json({ message: data });
});

module.exports = {
  profileRouter,
};
