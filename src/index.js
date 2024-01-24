const express = require("express");
const mogran = require("morgan");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./config/database");
const { jwtStrategy, protect } = require("./middlewares/authMiddleware");
const errorHandler = require("./controllers/errorController");

// Routes
const authRoutes = require("./routes/authRoutes");

const app = express();
db.connect();

app.use(mogran("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use("/auth", authRoutes);

app.get("/", protect, (req, res) => {
  res.send("Hello World!!");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
