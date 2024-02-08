const router = require("express").Router();
const authController = require("../controllers/authController");
const bodyValidator = require("../middlewares/bodyValidator");

router.post("/signup", bodyValidator("signUp"), authController.signUp);
router.post("/login", bodyValidator("login"), authController.login);

module.exports = router;
