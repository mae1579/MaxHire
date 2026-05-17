const express = require("express");
const { UserRecord } = require("../records/UserRecord");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {createMailOptions} = require("../utils/szablonPassword");
const {transporter} = require("../utils/gmailconfig");
const {ValidationError} = require("../utils/handleErrors");
const {loginByEmail} = require("../utils/szablonLoginUserByEmail");

const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserRecord.findOneByEmail(email);

  if (!user) {
    return res
      .status(401)
      .json({ message: "Wprowadzono niepoprawny adres email lub haslo" });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ message: "Wprowadzono niepoprawny adres email lub haslo" });
  }

  const tokenPayload = { id: user.id, role: user.role };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res
    .cookie("token_auth", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    .status(200)
    .json({
      message: "Zalogowano pomyślnie",
      user: { id: user.id, email: user.email, role: user.role, name: user.name, surname: user.surname, photo: user.photo, phone: user.phone },
    });
});


//Logowanie alternatynwe za pomocą adres e-mail. Etap 1
loginRouter.post("/email/loginuser", async(req,res) => {
  const loginUser = req.body.email;
  const findUser = await UserRecord.findOneByEmail(loginUser);
  if(!findUser){
    return res.status(200).json({Message:"Konto uzytkownika o takim e-mailu nie istnieje"});
  }
  const tokenPayload = { id: findUser.id, role: findUser.role };
  const token = jwt.sign(tokenPayload, process.env.JWT_EMAILLOGIN, {
    expiresIn: "5m",
  });

  const link = `http://localhost:5173/login/${token}`;

  const mailbody = loginByEmail(findUser.email, link, findUser.name);

  try {
    await transporter.sendMail(mailbody);
    res
        .status(200)
        .json({ message: "Wiadomosc z linkiem do logowania zostala wyslana" });
  } catch (error) {
    throw new ValidationError(
        "Wiadomosc nie moze zostac wyslana, sprobuj ponownie pozniej",
    );
  }

});

loginRouter.post("/email/login/", async(req,res) => {
  const tokenUser = req.body.token;
  let token;
  try {
    token = jwt.verify(tokenUser, process.env.JWT_EMAILLOGIN);
  }catch(err){
    return res.status(403).json({message:"Link wygasl !"});
  }

  const findUser = await UserRecord.findById(token.id);
  const payload = { id: findUser.id, role: findUser.role };
  const tokenLoginUser = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res
      .cookie("token_auth", tokenLoginUser, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })

      .status(200)
      .json({
        message: "Zalogowano pomyślnie",
        user: { id: findUser.id, email: findUser.email, role: findUser.role, name: findUser.name, surname: findUser.surname, photo: findUser.photo, phone: findUser.phone },
      });
});


module.exports = {
  loginRouter,
};
