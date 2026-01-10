const express = require("express");
const tokenAuth = require("../guards/authGuard");
const { OfferRecord } = require("../records/OfferRecord");
const addOfferRouter = express.Router();

addOfferRouter.post("/", tokenAuth, async (req, res) => {
  const { id: user_id } = req.user;
  const offer = await new OfferRecord({
    ...req.body,
    tech: JSON.stringify(req.body.tech),
    user_id: user_id,
  });

  const offerAdd = await offer.insert();
  res
    .status(200)
    .json({ message: `zgloszenie o id: ${offerAdd} zostalo dodane` });
});

module.exports = {
  addOfferRouter,
};
