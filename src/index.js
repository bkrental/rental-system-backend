const express = require("express");
const mogran = require("morgan");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const DB = require("./database");
const UserRoutes = require("./routes/user");
const AuthRoutes = require("./routes/auth");
const { jwtStrategy, protect } = require("./middlewares/auth");

const app = express();
DB.connect();

app.use(mogran("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/users", UserRoutes);
app.use("/auth", AuthRoutes);

app.use(protect);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
