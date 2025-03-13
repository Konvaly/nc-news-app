const express = require("express");
const app = express();

const endpoints = require("./endpoints.json");

const getEndpoints = require("./controllers/api.controllers");
const getTopics = require("./controllers/topics.controllers");
const getArticleById = require("./controllers/articles.controllers");

const {
    handleNonExistentEndpoint,
    handleCustomErrors,
    handleServerErrors,
    handlePsqlErrors
} = require("./controllers/errors.controllers");

//console.log(endpoints, ">> endpoints in app")

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all('/*', handleNonExistentEndpoint);

app.use(handleCustomErrors);
app.use(handleServerErrors);
app.use(handlePsqlErrors);

module.exports = app;

