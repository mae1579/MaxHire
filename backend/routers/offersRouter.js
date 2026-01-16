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

//Usuwanie zgłoszeń zalogowanego usera

offersRouter.delete("/deleteOffer/:id", tokenAuth, async (req, res) => {
  const offer_id = req.params.id;
  const findOffer = await OfferRecord.findOneByIdOffer(offer_id);
  console.log(findOffer);
  if (!findOffer) {
    throw new ValidationError("Ogloszenie nie istnieje w bazie");
  }
  const loginUser = req.user.id;
  console.log(findOffer);

  if (findOffer.user_id !== loginUser) {
    throw new ValidationError(
      "Zgloszenie nie nalezy do ciebie, brak mozliwosci usuniecia tego zgloszenia !",
    );
  }

  await findOffer.delete();
  res
    .status(200)
    .json({ message: `Zgloszenie o id: ${offer_id} zostalo usuniete` });
});

module.exports = {
  offersRouter,
};
