const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const getEndpoints = require("./controllers/api.controllers");

//console.log(endpoints, ">> endpoints in app")

app.get('/api', getEndpoints);

module.exports = app;