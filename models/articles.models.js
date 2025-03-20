const { status } = require("express/lib/response");
const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return rows[0];
        });
};

exports.fetchArticles = () => {
    return db.query(`
        SELECT a.author, a.title, a.article_id, a.topic, 
               a.created_at, a.votes, a.article_img_url,
               COUNT(c.comment_id) AS comment_count
        FROM articles AS a
        LEFT JOIN comments AS c ON a.article_id = c.article_id
        GROUP BY a.article_id
        ORDER BY a.created_at DESC;
        `)
        .then(({ rows }) => {
            return rows.map(article => ({
                ...article,
                comment_count: Number(article.comment_count)
            }))
        })
}

exports.updateArticleVotes = (article_id, inc_votes) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Invalid article ID" })
    }
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [inc_votes, article_id])
        .then(({ rows }) => {
            return rows[0]
        })
}