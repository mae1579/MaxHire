const { transporter } = require("./gmailconfig");
const createMailOptions = (userEmail, link) => {
  return {
    from: process.env.GMAIL_APP_EMAIL,
    to: "johnyhell25@gmail.com",
    subject: "Instrukcja zmiany hasła w systemie MaxHire",
    link: "",
    html: `
    <div style="background-color: #000000; color: #ffffff; padding: 40px; font-family: 'Segoe UI', Arial, sans-serif; text-align: center;">
        
        <h2 style="color: #ffffff; margin-bottom: 20px;">Zmiana hasła</h2>
        
        <p style="font-size: 16px; color: #dddddd; line-height: 1.6;">
            Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta  w systemie <strong>MaxHire</strong>.
        </p>

        <div style="margin: 40px 0;">
            <a href="${link}"
               style="background-color: #ffffff; color: #000000; padding: 14px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
               USTAW NOWE HASŁO
            </a>
        </div>

        <p style="font-size: 13px; color: #888888;">
            Jeśli to nie Ty wysłałeś zapytanie, po prostu zignoruj tę wiadomość.
        </p>

        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #333333; text-align: center;">
            <img src="https://res.cloudinary.com/dp8o4hppt/image/upload/v1768140555/MaxHire_m1ojpo.png" 
                 alt="MaxHire Footer"
                 style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto; border: 0;">
        </div>
    </div>
    `,
  };
};

//Uzycie wysylki.
// const mailbody = {
//   ...mailOptions,
//   to: "mateuszumiecki@gmail.com",
// };
// try {
//   await transporter.sendMail(mailbody);
//   res.send("Poszło! Sprawdź skrzynkę.");
// } catch (error) {
//   res.status(500).send("Coś padło: " + error.message);
// }

module.exports = {
  createMailOptions,
};
