const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");
const { fetchArticleById, fetchArticles } = require("../models/articles.models");
const { fetchCommentsByArticleId } = require("../models/comments.models");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article: article })
        })
        .catch(next);
}

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    if (!/^\d+$/.test(article_id)) {
        return res.status(400).send({ msg: "Invalid article ID" })
    }

    fetchArticleById(article_id)
        .then(() => fetchCommentsByArticleId(article_id))
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        })
}