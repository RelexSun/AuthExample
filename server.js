const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Shutting down server if error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down!!!");
  console.log(err.name, err.message);
  process.exit(1);
});

// import .env file
dotenv.config({ path: "./.env" });

const app = require("./app");

// replacing "<PASSWORD>" with the actual password that has a DATABASE_PASSWORD variable
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
); // connecting to the db
mongoose.connect(DB).then(() => console.log(`DB connected successfully`));

// Server running
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App running on port ${port}`)
);

// Shutting down server if error
process.on("uncaughtRejection", (err) => {
  console.log("Uncaught Rejection! Shutting down!!!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

