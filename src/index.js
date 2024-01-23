const express = require("express");
const mogran = require("morgan");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const DB = require("./database");

const app = express();
DB.connect();

app.use(mogran("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
