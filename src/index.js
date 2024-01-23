const express = require("express");
const mogran = require("morgan");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./config/database");
const { jwtStrategy, protect } = require("./middlewares/auth.middleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./controllers/errorController");

const app = express();
db.connect();

app.use(mogran("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/auth", authRoutes);

app.use(protect);
app.get("/", (req, res) => {
  res.send("Hello World!!");
});

// Error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
