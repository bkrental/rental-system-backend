const _ = require("lodash");
const Post = require("../models/post");
const postService = require("../services/postService");
const AppError = require("../utils/appError");
const wrapper = require("../utils/wrapper");
const sendResponse = require("../utils/sendResponse");

const postController = {
  getPosts: async (req, res) => {
    const posts = await postService.getPosts(req.query);

    sendResponse(res, { length: posts.length, posts }, 200);
  },

  getMyPosts: async (req, res) => {
    const userId = req.user.id;

    const posts = await postService.getPosts(req.query, { owner: userId });

    sendResponse(res, { length: posts.length, posts }, 200);
  },

  createPost: async (req, res) => {
    const post = await Post.create(req.body);

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

    if (post.owner.toString() !== userId) {
      throw new AppError("You are not authorized to update this post", 403);
    }

    await post.deleteOne();

    sendResponse(res, {}, 204);
  },
};

module.exports = wrapper(postController);
