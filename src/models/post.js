const e = require("express");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  property_type: {
    type: String,
    required: true,
  },
  transaction_type: {
    type: String,
    enum: ["rent", "sale"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  address: {
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    number: {
      type: String,
    },
  },
  location: {
    type: "Point",
    coordinates: [Number],
  },

  // Images
  thumbnail: {
    type: String,
    required: true,
  },
  images: [String],

  // Rooms
  bedrooms: Number,
  bathrooms: Number,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
