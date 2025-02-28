const db = require("../connection")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics")
    })
    .then(() => {
      return db.query(
        "CREATE TABLE topics(slug VARCHAR(100) PRIMARY KEY, description VARCHAR NOT NULL, img_url VARCHAR(1000))"
      )
    })
    .then(() => {
      return db.query(
        "CREATE TABLE users(username VARCHAR(50) PRIMARY KEY, name VARCHAR(100) NOT NULL, avatar_url VARCHAR(1000))"
      )
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, 
        topic VARCHAR (100) REFERENCES topics(slug) ON DELETE CASCADE,
        author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000))`)
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
         comment_id SERIAL PRIMARY KEY,
         article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
         body TEXT NOT NULL,
         votes INT DEFAULT 0,
         author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
         created_at TIMESTAMP DEFAULT NOW()
        )`)
    })
};
module.exports = seed;
