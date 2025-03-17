const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        `, [article_id])
        .then(({ rows }) => {
            return rows;
        })
};

exports.addCommentToArticle = (article_id, username, body) => {
    const queryStr = `
    INSERT INTO comments (body, article_id, author, votes, created_at)
    VALUES ($1, $2, $3, 0, NOW())
    RETURNING *;
    `
    return db.query(queryStr, [body, article_id, username])
        .then(({ rows }) => {
            return rows[0];
        })
}