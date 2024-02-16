const router = require("express").Router();
const postController = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const bodyValidator = require("../middlewares/bodyValidator");

router.get("/", postController.getPosts);

router.get("/me", protect, postController.getMyPosts);

router.post("/bulk", postController.createPostBulk);

router.post(
  "/",
  protect,
  bodyValidator("createPost"),
  postController.createPost
);

router.patch(
  "/:id",
  protect,
  bodyValidator("updatePost"),
  postController.updatePost
);

router.delete("/:id", protect, postController.deletePost);

module.exports = router;
