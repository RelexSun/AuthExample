const express = require("express");

const userRoute = require("./route/userRoute");
const app = express();

// Global middleware
app.use(express.json()); // parse incoming requests with JSON payloads

// ROUTES
app.use("/api/users", userRoute);

module.exports = app;
