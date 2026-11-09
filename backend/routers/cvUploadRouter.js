const express = require("express");
const tokenAuth = require("../guards/authGuard");
const multer = require("multer");
const { UserRecord } = require("../records/UserRecord");
const { ValidationError } = require("../utils/handleErrors");
const { cvStorage } = require("../utils/cloudinaryConfig");
const authorizeRoles = require("../guards/authorizeRoles");
const cloudinary = require("cloudinary").v2;

// Upload cv na serwer.
// Gdy chce aby link sciagal:
// let cvUrl = req.file.path;
//     cvUrl = cvUrl.replace("/upload/", "/upload/fl_attachment/");
//     await UserRecord.updateUserCv(findUser.id, cvUrl.toString());
// Jesli chcesz podglad:
// usuwasz cvUrl = cvUrl.replace("/upload/", "/upload/fl_attachment/");
const cvUploadRouter = express.Router();

//Usuwanie cv przez admina
cvUploadRouter.delete(
  "/admin/removeUserCv/:user_id",
  tokenAuth,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const findUser = await UserRecord.findById(req.params.user_id);
      console.log(req.params.user_id);

      if (!findUser || !findUser.cv_url) {
        throw new ValidationError("Użytkownik nie posiada zapisanego CV.");
      }

      const cvUrl = findUser.cv_url;

      const match = cvUrl.match(/\/v\d+\/(.+)\.pdf$/i);

      if (!match) {
        throw new ValidationError(
          "Nie udało się odczytać identyfikatora pliku z linku.",
        );
      }

      const publicId = match[1];

      await cloudinary.uploader.destroy(publicId);

      await findUser.deleteUserCv();
      res.status(200).json({
        message: ` CV Usera: ${findUser.name} ${findUser.surname} został pomyślnie usunięty.`,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        throw err;
      }
      res.status(500).json({
        message: "Wystąpił błąd podczas usuwania CV.",
        error: err.message,
      });
    }
  },
);

//Usuwanie cv zalogowanego Usera
cvUploadRouter.delete("/removeUserCv", tokenAuth, async (req, res) => {
  try {
    const findUser = await UserRecord.findById(req.user.id);

    if (!findUser || !findUser.cv_url) {
      throw new ValidationError("Użytkownik nie posiada zapisanego CV.");
    }

    const cvUrl = findUser.cv_url;

    const match = cvUrl.match(/\/v\d+\/(.+)\.pdf$/i);

    if (!match) {
      throw new ValidationError(
        "Nie udało się odczytać identyfikatora pliku z linku.",
      );
    }

    const publicId = match[1];

    await cloudinary.uploader.destroy(publicId);

    await findUser.deleteUserCv();
    res.status(200).json({ message: "Plik CV został pomyślnie usunięty." });
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    }
    res.status(500).json({
      message: "Wystąpił błąd podczas usuwania CV.",
      error: err.message,
    });
  }
});
cvUploadRouter.post("/uploadcv", tokenAuth, async (req, res) => {
  const findUser = await UserRecord.findById(req.user.id);
  if (!findUser) {
    throw new ValidationError("Uzytkownik nie istnieje!");
  }

  const upload = multer({
    storage: cvStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("ZLY_FORMAT"), false);
      }
    },
  });

  try {
    await new Promise((resolve, reject) => {
      upload.single("cvFile")(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    if (!req.file) {
      throw new ValidationError(
        "Brak pliku lub nieprawidłowy format (wymagany PDF).",
      );
    }

    let cvUrl = req.file.path;
    const cvUrlDowload = cvUrl.replace("/upload/", "/upload/fl_attachment/");
    await UserRecord.updateUserCv(findUser.id, cvUrl.toString());
    res
      .status(200)
      .json({ message: "Plik CV zostal zapisany", cvUrl, cvUrlDowload });
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    }

    throw new ValidationError(
      "Brak pliku lub nieprawidłowy format (wymagany PDF).",
    );
  }
});

module.exports = { cvUploadRouter };
