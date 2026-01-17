const express = require("express");
const tokenAuth = require("../guards/authGuard");
const { OfferRecord } = require("../records/OfferRecord");
const { ValidationError } = require("../utils/handleErrors");

const offerRouter = express.Router();

//Wyswietlenie ofert zalogowanego uzytkownika
offerRouter.get("/user/:id", tokenAuth, async (req, res) => {
  const { id } = req.params;
  const data = await OfferRecord.findOneByUserId(id);
  // if (!data) {
  //   throw new ValidationError("Uzytkownik nie dodal jeszcze zadnych ofert");
  // }
  res.status(200).json({ message: data || [] });
});
//Wyswietlenie jednej konkretnej oferty
offerRouter.get("/getOffer/:id", tokenAuth, async (req, res) => {
  const data = await OfferRecord.getOneOffer(req.params.id);
  if (!data) {
    throw new ValidationError("Zgloszenie nie istnieje !");
  }
  res.status(200).json({ message: data });
});

module.exports = {
  offerRouter,
};
