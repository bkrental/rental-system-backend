const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },

  area: {
    type: Number,
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
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
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

  contact: {
    name: String,
    phone: String,
  },

  post_url: String,

  source: {
    type: String,
    default: "internal",
  },
});

// Populate owner field
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "name email avatar",
  });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
