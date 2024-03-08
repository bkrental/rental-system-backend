const Post = require("../models/post");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");

const postService = {
  getPosts: async (queryObj, filterObj = {}) => {
    const query = new APIFeatures(Post.find(filterObj), queryObj)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .searchByKeyword(["name", "description"]);

    const posts = await query.query;

    return posts;
  },
};

module.exports = postService;
