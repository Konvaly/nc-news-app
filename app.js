const express = require("express");
const app = express();

app.use(express.json()); //ensures JSON requests are parsed

const endpoints = require("./endpoints.json");

const { getEndpoints } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId } = require("./controllers/articles.controllers");

const {
    handleNonExistentEndpoint,
    handleCustomErrors,
    handleServerErrors,
    handlePsqlErrors
} = require("./controllers/errors.controllers");

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.all('/*', handleNonExistentEndpoint);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

