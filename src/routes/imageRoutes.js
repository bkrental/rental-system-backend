const router = require("express").Router();
const multer = require("multer");
const imageController = require("../controllers/imageController");
const AppError = require("../utils/appError");

const upload = multer({
  fileFilter: (req, file, cb) => {
    // Only accept png, jpg, jpeg
    const allowedMimes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new AppError("Invalid file type. Only accepts png, jpg, jpeg", 400));
    }

    cb(null, true);
  },
});

router.post(
  "/upload-single",
  upload.single("image"),
  imageController.storeSingle
);

router.post(
  "/upload-multiple",
  upload.array("images", 30),
  imageController.storeMultiple
);

module.exports = router;
