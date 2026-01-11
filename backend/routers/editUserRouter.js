const express = require("express");
const tokenAuth = require("../guards/authGuard");
const { UserRecord } = require("../records/UserRecord");
const { ValidationError } = require("../utils/handleErrors");
const { mailOptionsP } = require("../utils/szablonPassword");
const { transporter } = require("../utils/gmailconfig");
const editUserRouter = express.Router();

//Aktualizacja danych zalogowanego użytkownika.
editUserRouter.post("/", tokenAuth, async (req, res) => {
  const finduser = await UserRecord.findById(req.user.id);
  if (!finduser) {
    throw new ValidationError("uzytkownik nie istnieje");
  }
  const newUser = new UserRecord({
    ...finduser,
    ...req.body,
  });

  try {
    await newUser.update();
    res.status(200).json({ message: "Dane profilowe zostały zaaktualizowane" });
  } catch (error) {
    console.log(error);
  }
});

//Zmiana Hasła 1 krok wysłanie maila weryfikacyjnego.:

editUserRouter.post("/forgetPassword", async (req, res) => {
  const userMail = req.body.email;

  const finduser = await UserRecord.findOneByEmail(userMail);
  if (!finduser) {
    throw new ValidationError("Uzytkownik o takim e-mailu nie istnieje");
  }

  const mailbody = {
    ...mailOptionsP,
    to: userMail,
  };

  console.log(mailbody.to);
  try {
    await transporter.sendMail(mailbody);
    res
      .status(200)
      .json({ message: "Wiadomosc z linkiem do zmiany hasla zostala wyslana" });
  } catch (error) {
    throw new ValidationError(
      "Wiadomosc nie moze zostac wyslana, sprobuj ponownie pozniej",
    );
  }
});

module.exports = {
  editUserRouter,
};
