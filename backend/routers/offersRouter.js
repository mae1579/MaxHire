const express = require("express");
const { OfferRecord } = require("../records/OfferRecord");
const { UserRecord } = require("../records/UserRecord");
const offersRouter = express.Router();

offersRouter.get("/", async (req, res) => {
  res.status(200).json(await OfferRecord.findAll());
});

module.exports = {
  offersRouter,
};
