const express = require("express");
const { OfferRecord } = require("../records/OfferRecord");
const { UserRecord } = require("../records/UserRecord");
const tokenAuth = require("../guards/authGuard");
const offersRouter = express.Router();

offersRouter.get("/", tokenAuth, async (req, res) => {
  res.status(200).json(await OfferRecord.findAll());
});

module.exports = {
  offersRouter,
};
