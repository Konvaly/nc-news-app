const express = require("express");
const app = express();

const endpoints = require("./endpoints.json");

const getEndpoints = require("./controllers/api.controllers");
const getTopics = require("./controllers/topics.controllers");

//console.log(endpoints, ">> endpoints in app")

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);

module.exports = app;

