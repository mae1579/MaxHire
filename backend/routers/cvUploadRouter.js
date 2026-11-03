const express = require("express");
const tokenAuth = require("../guards/authGuard");
const multer = require("multer");
const { UserRecord } = require("../records/UserRecord");
const { ValidationError } = require("../utils/handleErrors");
const { cvStorage } = require("../utils/cloudinaryConfig");
// const upload = multer({ storage: cvStorage });

// Upload cv na serwer.
const cvUploadRouter = express.Router();

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

    // Gdy chce aby link sciagal:
    // let cvUrl = req.file.path;
    //     cvUrl = cvUrl.replace("/upload/", "/upload/fl_attachment/");
    //     await UserRecord.updateUserCv(findUser.id, cvUrl.toString());
    // Jesli chcesz podglad:
    // usuwasz cvUrl = cvUrl.replace("/upload/", "/upload/fl_attachment/");
    if (!req.file) {
      throw new ValidationError(
        "Brak pliku lub nieprawidłowy format (wymagany PDF).",
      );
    }

    let cvUrl= req.file.path;
    const cvUrlDowload  = cvUrl.replace("/upload/", "/upload/fl_attachment/");
    await UserRecord.updateUserCv(findUser.id, cvUrl.toString());
    res.status(200).json({ message: "Plik CV zostal zapisany", cvUrl, cvUrlDowload });
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
