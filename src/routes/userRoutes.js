const router = require("express").Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const requestValidator = require("../middlewares/requestValidator");


router.get("/:id", userController.getUserById);

router.patch(
  "/personal-info",
  protect,
  requestValidator("updateUserInfo"),
  userController.updateUserInfo
);

router.patch(
  "/password-update",
  protect,
  requestValidator("updateUserPassword"),
  userController.updateUserPassword,
);

module.exports = router;
