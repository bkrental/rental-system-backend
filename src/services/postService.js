const Post = require("../models/post");
const APIFeatures = require("../utils/apiFeatures");

const postService = {
  getPosts: async (queryObj, filterObj = {}) => {
    const query = new APIFeatures(Post.find(filterObj), queryObj)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const posts = await query.query;

    return posts;
  },
};

module.exports = postService;
