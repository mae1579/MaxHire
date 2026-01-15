const express = require("express");
const { OfferRecord } = require("../records/OfferRecord");
const { UserRecord } = require("../records/UserRecord");
const tokenAuth = require("../guards/authGuard");
const { ValidationError } = require("../utils/handleErrors");
const offersRouter = express.Router();

offersRouter.get("/", tokenAuth, async (req, res) => {
  const search = req.query.search || "";
  const limit = 7;
  const page = parseInt(req.query.page) || 1;
  const offset = (parseInt(page) - 1) * limit;

  const data = await OfferRecord.findAllFiltr(limit, offset, search);

  res.status(200).json(data);
});

module.exports = {
  offersRouter,
};
