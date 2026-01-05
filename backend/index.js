const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { urlencoded } = require("express");
const { registerRouter } = require("./routers/registerRouter");
const { handleError } = require("./utils/handleErrors");
const { loginRouter } = require("./routers/loginRouter");
const { homeRouterUser } = require("./routers/homeRouterUser");
const { logoutRouter } = require("./routers/logoutRouter");
const { addOfferRouter } = require("./routers/addOfferRouter");
const { offersRouter } = require("./routers/offersRouter");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/homeUser", homeRouterUser);
app.use("/logout", logoutRouter);
app.use("/addOffer", addOfferRouter);
app.use("/offers", offersRouter);

app.use(handleError);

app.listen(3000, "localhost", () => {
  console.log("Server is running on localhost");
});
