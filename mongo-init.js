db.createCollection("users");

// Insert admin user
db.getCollection("users").insertMany([
  {
    name: "Dat Nguyen",
    phone: "0828696919",
    email: "datdev2409@gmail.com",
    password: "$2b$10$2SwvT.ofg0zqQ3u5aGmqme4oJ3.AlS.klsneo4CzTeET4WapR9K5y",
    role: "admin",
  },
]);
