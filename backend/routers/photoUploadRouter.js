const express = require("express");
const multer = require("multer");
const storage = require("../utils/cloudinaryConfig");
const tokenAuth = require("../guards/authGuard");
const { UserRecord } = require("../records/UserRecord");
const { ValidationError } = require("../utils/handleErrors");
const {storagePhoto} = require("../utils/cloudinaryConfig");
const upload = multer({ storage: storagePhoto });

const photoUploadRouter = express.Router();

photoUploadRouter.post(
  "/profilePhoto",
  tokenAuth,
  upload.single("profilePhoto"),
  async (req, res) => {
    const findUser = await UserRecord.findById(req.user.id);
    if (!findUser) {
      throw new ValidationError("Uzytkownik nie istnieje !");
    }
    try {
      const photoUrl = req.file.path;
      await UserRecord.updateProfilePhoto(findUser.id, photoUrl.toString());
      res.status(200).json({ message: "zdjecie zostalo zapisane" });
    } catch (err) {
      throw new ValidationError("Nie udalo sie zapisac zdjecia");
    }
  },
);

module.exports = {
  photoUploadRouter,
};
