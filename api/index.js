// api/index.js

const express = require("express");
const app = express();
const port = 3000;

module.exports = serverless(app);
