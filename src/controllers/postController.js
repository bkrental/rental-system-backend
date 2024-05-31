const _ = require("lodash");
const Post = require("../models/post");
const User = require("../models/user");
const postService = require("../services/postService");
const QueueService = require("../services/queueService");
const AppError = require("../utils/appError");
const wrapper = require("../utils/wrapper");
const getLocationQueryObj = require("../utils/getLocationQueryObj");
const sendResponse = require("../utils/sendResponse");
const { NOTIFICATION_TEMPLATES } = require("../config/constants");

const postController = {
  getPost: async (req, res) => {
    const post = await Post.findById(req.params.id);

    sendResponse(res, { post }, 200);
  },

  getMyPosts: async (req, res) => {
    const userId = req.user.id;

    const { posts, metadata } = await postService.getPosts(req.query, {
      owner: userId,
    });

    res.status(200).json({
      status: "success",
      data: posts,
      pagination: metadata,
    });
  },

  getFavoritePosts: async (req, res) => {
    const userId = req.user.id;

    const { favourites } = await User.findById(userId).select("favourites");

    const { posts, metadata } = await postService.getPosts(req.query, {
      _id: { $in: favourites },
    });

    res.status(200).json({
      status: "success",
      data: posts,
      pagination: metadata,
    });
  },

  getPosts: async (req, res) => {
    // Pass the userId to req.query to check if the post is in favorites
    if (req?.user && req.user.id) {
      req.query.userId = req.user.id;
    }

    const { posts, metadata } = await postService.getPosts(req.query);

    res.status(200).json({
      status: "success",
      data: posts,
      pagination: metadata,
    });
  },

  createPost: async (req, res) => {
    const userId = req.user.id;

    const post = await Post.create(Object.assign(req.body, { owner: userId }));
    const user = await User.findById(userId).select("+email");

    if (user.email) {
      const queueService = await QueueService.getInstance();
      const msg = {
        userName: user.name,
        postId: post._id,
        postTitle: post.name,
        template: NOTIFICATION_TEMPLATES.POST_CREATED,
        userEmail: user.email,
      };

      await queueService.publishMsg("email_queue", msg);
      console.log("Published to queue: email_queue");
    }

    sendResponse(res, { post }, 201);
  },

  createPostBulk: async (req, res) => {
    const posts = await Post.insertMany(req.body);

    sendResponse(res, { length: posts.length, posts }, 201);
  },

  updatePost: async (req, res) => {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.owner.toString() !== userId) {
      throw new AppError("You are not authorized to update this post", 403);
    }

    const updatedPost = _.merge(post, req.body);
    await updatedPost.save();

    sendResponse(res, { posts: updatedPost }, 200);
  },

  deletePost: async (req, res) => {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.owner._id.toString() !== userId) {
      throw new AppError("You are not authorized to update this post", 403);
    }

    await post.deleteOne();

    const user = await User.findById(userId);

    if (user.email) {
      console.log("user:", user);
      const queueService = await QueueService.getInstance();

      const msg = {
        userName: user.name,
        postTitle: post.name,
        template: NOTIFICATION_TEMPLATES.POST_DELETED,
        userEmail: user.email,
      };

      await queueService.publishMsg("email_queue", msg);
    }

    sendResponse(res, {}, 204);
  },

  addFavorite: async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    console.log(postId);

    const user = await User.findById(userId);

    if (user.favourites.includes(postId)) {
      throw new AppError("Post already in favorites", 400);
    }

    user.favourites.push(postId);
    await user.save();

    const favPosts = await postService.getPosts(
      {},
      { _id: { $in: user.favourites } }
    );

    sendResponse(res, { length: favPosts.length, posts: favPosts }, 200);
  },

  removeFavorite: async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const user = await User.findById(userId);

    if (!user.favourites.includes(postId)) {
      throw new AppError("Post not in favorites", 400);
    }

    user.favourites.pull(postId);
    await user.save();

    const favPosts = await postService.getPosts(
      {},
      { _id: { $in: user.favourites } }
    );

    sendResponse(res, { length: favPosts.length, posts: favPosts }, 200);
  },
};
module.exports = wrapper(postController);
