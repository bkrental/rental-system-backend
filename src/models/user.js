const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password when query
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
      select: false,
    },
    favourites: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },
    rating: {
      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
