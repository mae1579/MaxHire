const express = require("express");
const tokenAuth = require("../guards/authGuard");
const { UserRecord } = require("../records/UserRecord");
const { ValidationError } = require("../utils/handleErrors");
const { mailOptionsP } = require("../utils/szablonPassword");
const { transporter } = require("../utils/gmailconfig");
const editUserRouter = express.Router();
const jwt = require("jsonwebtoken");
const { createMailOptions } = require("../utils/szablonPassword");
const bcrypt = require("bcrypt");

//Aktualizacja danych (email i numer) zalogowanego użytkownika.
editUserRouter.patch("/", tokenAuth, async (req, res) => {
  const finduser = await UserRecord.findById(req.user.id);

  if (!finduser) throw new ValidationError("uzytkownik nie istnieje");
  if (finduser.id !== req.user.id) return res.status(403).send();

  const newUser = new UserRecord({
    ...finduser,
    email: req.body.email || finduser.email,
    phone: req.body.phone || finduser.phone,
  });

  try {
    await newUser.update();
    res.status(200).json({ message: "Dane profilowe zostały zaaktualizowane" });
  } catch (error) {
    res.status(400).json({ message: "Błąd aktualizacji" });
  }
});

//Zmiana Hasła 1 krok wysłanie maila weryfikacyjnego.:

editUserRouter.post("/forgetPassword", async (req, res) => {
  const userMail = req.body.email;

  const finduser = await UserRecord.findOneByEmail(userMail);
  if (!finduser) {
    throw new ValidationError("Uzytkownik o takim e-mailu nie istnieje");
  }
  const token = jwt.sign({ id: finduser.id }, process.env.JWT_SECRET2, {
    expiresIn: "1h",
  });

  const link = `http://localhost:5173/recover/${token}`;

  const mailbody = createMailOptions(userMail, link);

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

// zmiana hasła 2 krok
editUserRouter.patch("/changePassword", async (req, res) => {
  const data = req.body;
  const decoded = jwt.verify(data.token, process.env.JWT_SECRET2);
  const userId = decoded.id;
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(process.env.BCRYPT_SALT),
  );

  const user = await UserRecord.findById(userId);
  const updatedUser = new UserRecord({
    ...user,
    password: hashedPassword,
  });

  try {
    await updatedUser.update();
    res.status(200).json({ message: "Haslo zostalo zmienione !" });
  } catch (error) {
    throw new ValidationError(
      ` Wystapil blad podczas aktualizacji hasla ${error}`,
    );
  }
});

module.exports = {
  editUserRouter,
};
