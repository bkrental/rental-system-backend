const _ = require("lodash");
const Post = require("../models/post");
const User = require("../models/user");
const postService = require("../services/postService");
const QueueService = require("../services/queueService");
const AppError = require("../utils/appError");
const wrapper = require("../utils/wrapper");
const getLocationQueryObj = require("../utils/getLocationQueryObj");
const sendResponse = require("../utils/sendResponse");

const postController = {
  getPost: async (req, res) => {
    const post = await Post.findById(req.params.id);

    sendResponse(res, { post }, 200);
  },

  getMyPosts: async (req, res) => {
    const userId = req.user.id;

    const posts = await postService.getPosts(req.query, { owner: userId });

    sendResponse(res, { length: posts.length, posts }, 200);
  },

  getFavoritePosts: async (req, res) => {
    const userId = req.user.id;

    const { favourites: favIdLists } = await User.findById(userId).select(
      "favourites"
    );

    const favPosts = await postService.getPosts(req.query, {
      _id: { $in: favIdLists },
    });

    sendResponse(res, { length: favPosts.length, posts: favPosts }, 200);
  },

  getPosts: async (req, res) => {
    const queryObj = {
      ..._.omit(req.query, ["center", "distance", "unit"]),
      ...getLocationQueryObj(req.query),
    };

    const posts = await postService.getPosts(queryObj);
    const postsWithFavouriteField = await postService.addFavouriteField(
      posts,
      req?.user?.id
    );

    sendResponse(
      res,
      {
        length: postsWithFavouriteField.length,
        posts: postsWithFavouriteField,
      },
      200
    );
  },

  createPost: async (req, res) => {
    const userId = req.user.id;

    const post = await Post.create(Object.assign(req.body, { owner: userId }));
    const queueService = await QueueService.getInstance();

    const user = await User.findById(userId)
    const msg = {
      userName: user.name,
      postId: post._id,
      postTitle: post.name,
      template: "postCreated",
      userEmail: "nguyenphuoclhp2508@gmail.com",
    };

    await queueService.publishMsg("notification", msg);

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

  addFavorite: async (req, res) => {
    const userId = req.user.id;
    const postId = req.body.id;

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
    const postId = req.query.id;

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
