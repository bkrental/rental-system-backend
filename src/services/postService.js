const Post = require("../models/post");
const User = require("../models/user");
const getLocationQueryObj = require("../utils/getLocationQueryObj");
const polyline = require("@mapbox/polyline");
const turf = require("@turf/turf");

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
    const query = { ...filterObj };
    const { bp, tp, ba, ta, pt, transaction, boundary, userId } = queryObj;

    // Price
    if (bp || tp) {
      query.price = {};
      if (tp) query.price.$lte = Number(tp);
      if (bp) query.price.$gte = Number(bp);
    }

    // Area
    if (ba || ta) {
      query.area = {};
      if (ta) query.area.$lte = Number(ta);
      if (ba) query.area.$gte = Number(ba);
    }

    // Property Type
    if (pt) {
      const propertyTypesArray = pt.split(",");
      query.property_type = { $in: propertyTypesArray };
    }

    if (transaction) query.transaction_type = transaction;

    const { center, radius = 3, unit = "km" } = queryObj;
    if (center && radius) {
      const coordinates = center.split(",").map((coord) => parseFloat(coord));
      console.log(coordinates);

      query.location = getLocationQueryObj({ center, distance: radius, unit });
    }

    if (boundary) {
      const decodedBoundary = polyline.decode(boundary);
      const boundaryCoordinates = decodedBoundary.map((coord) =>
        coord.reverse()
      );
      boundaryCoordinates.push(boundaryCoordinates[0]);

      const initialPolygon = turf.polygon([boundaryCoordinates]);
      const kinks = turf.kinks(initialPolygon);

      let validPolygon = initialPolygon;

      if (kinks.features.length > 0) {
        validPolygon = turf.convex(initialPolygon);
      }

      query.location = {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: validPolygon.geometry.coordinates,
          },
        },
      };
    }

    // Pagination
    const page = queryObj?.page || 1;
    const limit = queryObj?.limit || 10;
    const skip = (page - 1) * limit;

    let posts = await Post.find(query).skip(skip).limit(limit);
    const totalRecords = await Post.countDocuments(query);

    // Add isFavourite field to posts
    posts = await postService.addFavouriteField(posts, userId);

    const metadata = {
      current_page: page,
      page_size: limit,
      total_records: totalRecords,
      total_pages: Math.ceil(totalRecords / limit),
    };

    return { posts, metadata };
  },
};

module.exports = postService;
