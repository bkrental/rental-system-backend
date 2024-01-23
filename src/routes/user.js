const userController = require("../controllers/user");

const router = require("express").Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

module.exports = router;
