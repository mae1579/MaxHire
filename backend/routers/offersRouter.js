const express = require("express");
const { OfferRecord } = require("../records/OfferRecord");
const { UserRecord } = require("../records/UserRecord");
const tokenAuth = require("../guards/authGuard");
const { ValidationError } = require("../utils/handleErrors");
const offersRouter = express.Router();

offersRouter.get("/", tokenAuth, async (req, res) => {
  const data = await OfferRecord.findAll();
  if (!data) {
    throw new ValidationError(
      "Aktualnie nie ma zadnych zgloszen, sprobuj ponownie pozniej",
    );
  }
  res.status(200).json(data);
});

module.exports = {
  offersRouter,
};
