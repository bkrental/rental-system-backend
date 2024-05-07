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
    let query = {};
    const { bp, tp, ba, ta, pt, q, transaction_type } = queryObj;

    // Price
    bp && (query.price = { $gte: bp });
    tp && (query.price = { ...query.price, $lte: tp });

    // Area
    ba && (query.area = { $gte: ba });
    ta && (query.area = { ...query.area, $lte: ta });

    // Property Type
    pt && (query.property_type = { $in: pt.split(",") });

    transaction_type && (query.transaction_type = transaction_type);

    // Keyword
    if (q) {
      query = {
        ...query,
        $or: [
          { name: { $regex: new RegExp(q, "i") } },
          { description: { $regex: new RegExp(q, "i") } },
        ],
      };
    }

    // Pagination
    const page = queryObj.page;
    const limit = queryObj.limit;
    const skip = (page - 1) * limit;

    const posts = await Post.find(query).skip(skip).limit(limit);
    const totalRecords = await Post.countDocuments(query);

    return { posts, totalRecords };
  },
};

module.exports = postService;
