const router = require("express").Router();
const postController = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const bodyValidator = require("../middlewares/bodyValidator");

router.get("/", postController.getPosts);

router
  .use(protect)
  .get("/me", postController.getMyPosts)
  .post("/", bodyValidator("createPost"), postController.createPost)
  .patch("/:id", bodyValidator("updatePost"), postController.updatePost)
  .delete("/:id", postController.deletePost);

module.exports = router;
