const router = require("express").Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const requestValidator = require("../middlewares/requestValidator");
const User = require("../models/user");

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      name: { $regex: q, $options: "i" },
    }).select("_id name avatar");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
  userController.updateUserPassword
);

module.exports = router;
