const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");
const { fetchArticleById, fetchArticles } = require("../models/articles.models");
const { fetchCommentsByArticleId, addCommentToArticle } = require("../models/comments.models");

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

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username || !body) {
        return res.status(400).send({ msg: "Missing required fields" })
    };

    const articleId = Number(article_id);

    if (isNaN(articleId)) {
        return res.status(400).send({ msg: "Invalid article ID" })
    }

    fetchArticleById(articleId)
        .then(() => {
            return addCommentToArticle(article_id, username, body)
        })
        .then((comment) => res.status(201).send({ comment }))
        .catch((err) => {
            if (err.status === 404) {
                return res.status(404).send({ msg: "Article not found" })
            }
            if (err.code === "23503") {
                return res.status(404).send({ msg: "User not found" })
            }
        })
}