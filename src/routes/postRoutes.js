const router = require("express").Router();
const postController = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const requestValidator = require("../middlewares/requestValidator");

router.get("/", postController.getPosts);

router.get("/me", protect, postController.getMyPosts);

router.get("/favorites", protect, postController.getFavoritePosts);

router.get("/:id", postController.getPost);

router.post(
  "/bulk",
  requestValidator("createPostBulk"),
  postController.createPostBulk
);

router.post(
  "/",
  protect,
  requestValidator("createPost"),
  postController.createPost
);

router.patch(
  "/:id",
  protect,
  requestValidator("updatePost"),
  postController.updatePost
);

router.delete("/:id", protect, postController.deletePost);

module.exports = router;
