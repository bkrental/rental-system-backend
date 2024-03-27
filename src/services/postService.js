const Post = require("../models/post");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");

const postService = {
  addFavouriteField: async (posts, userId) => {
    if (!userId) return posts;

    const user = await User.findById(userId).select("favourites");

    return posts.map((post) => ({
      ...post._doc,
      isFavourite: (user?.favourites || []).includes(post._id),
    }));
  },

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
