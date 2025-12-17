const { Router } = require("express");
const { UserRecord } = require("../records/UserRecord");
const bcrypt = require("bcrypt");

const registerRouter = new Router();

registerRouter.post("/", async (req, res) => {
  const { email, password, name, surname, phone } = req.body;
  let user = await UserRecord.findOneByEmail(email);
  if (user !== null) {
    return res
      .status(409)
      .json({ message: "Uzytkownik o takim emailu juz istnieje" });
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT),
  );
  console.log(hashedPassword);

  user = await new UserRecord({
    email,
    password: hashedPassword,
    role: "user",
    name,
    surname,
    phone,
  });
  await user.insert();
  res.status(201).send(`Dodano użytkownika o numerze id: ${user.id}`);
});

module.exports = {
  registerRouter,
};
