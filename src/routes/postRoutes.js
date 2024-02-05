const router = require("express").Router();
const postController = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", postController.getPosts);

router
  .use(protect)
  .get("/me", postController.getMyPosts)
  .post("/", postController.createPost)
  .patch("/:id", postController.updatePost)
  .delete("/:id", postController.deletePost);

module.exports = router;
