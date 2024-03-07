const router = require("express").Router();
const authController = require("../controllers/authController");
const requestValidator = require("../middlewares/requestValidator");

router.post("/signup", requestValidator("signUp"), authController.signUp);
router.post("/login", requestValidator("login"), authController.login);

module.exports = router;
