const express = require("express");
const mogran = require("morgan");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./config/database");
const {
  jwtStrategy,
  protect,
  decodeToken,
} = require("./middlewares/authMiddleware");
const errorHandler = require("./controllers/errorController");

const app = express();
db.connect();

app.use(cors());
app.use(helmet());
app.use(mogran("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);
app.use(decodeToken);

app.use("/auth", require("./routes/authRoutes"));
app.use("/posts", require("./routes/postRoutes"));
app.use("/images", require("./routes/imageRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/messages", require("./routes/messageRoutes"));

app.get("/", protect, (req, res) => {
  res.send("Hello World!!");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK!");
});

// Error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
