const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next();
  }

  const jwtToken = authHeader.split(" ")[1];
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, data) => {
    console.log(data);
    if (!err) req.user = data;

    next();
  });
};

const protect = passport.authenticate("jwt", {
  session: false,
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  const userId = payload.id;
  const user = await User.findById(userId);

  if (user) {
    return done(null, user);
  }

  return done(false, null);
});

module.exports = { jwtStrategy, protect, decodeToken };
