const mongoose = require("mongoose");

async function connect() {
  const dbConnectionString = process.env.DB_CONNECTION_STRING;
  console.log("Connecting to database...");
  try {
    await mongoose.connect(dbConnectionString);
    console.log("Connected to database");
  } catch (err) {
    console.log("Failed to connect to database");
    console.log(err);
  }
}

module.exports = { connect };
