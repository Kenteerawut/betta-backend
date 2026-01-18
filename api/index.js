const express = require("express");
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api", require("../routes"));

module.exports = app;
