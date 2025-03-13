const express = require("express");
const app = express();

const endpoints = require("./endpoints.json");

const getEndpoints = require("./controllers/api.controllers");
const getTopics = require("./controllers/topics.controllers");

const {
    handleNonExistentEndpoint,
    handleCustomErrors,
    handleServerErrors
} = require("./controllers/errors.controllers");

//console.log(endpoints, ">> endpoints in app")

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);

app.all('/*', handleNonExistentEndpoint);

app.use(handleCustomErrors);
app.use(handleServerErrors)

module.exports = app;

