const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/userModel");

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

module.exports = { jwtStrategy, protect };
