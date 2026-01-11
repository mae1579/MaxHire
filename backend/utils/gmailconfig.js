const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

module.exports = {
  transporter,
};
