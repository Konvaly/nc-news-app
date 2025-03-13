const db = require("../connection");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  // Firstly we need to drop table if they exist and start from 
  // the table which contains columns with references to other tables
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
        article_id SERIAL PRIMARY KEY, 
        title VARCHAR(255) NOT NULL, 
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
    //Insert data in tables
    .then(() => {
      const formattedTopic = topicData.map(({ slug, description, img_url }) => [slug, description, img_url]);
      const queryStr = format(`INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`, formattedTopic)
      return db.query(queryStr)
    })
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => [username, name, avatar_url]);
      const queryStr = format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`, formattedUsers);
      return db.query(queryStr);
    })
    .then(() => {
      const formattedArticles = articleData.map(({ title, topic, author, body, created_at, votes, article_img_url }) => {
        //
        return [title, topic, author, body, new Date(created_at), votes || 0, article_img_url];
      });
      const queryStr = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticles
      );
      return db.query(queryStr);
    })
    .then(({ rows }) => {
      //console.log(rows, "<-- these are the rows")
      const articleIdLookup = {}
      rows.forEach(articleRow => {
        articleIdLookup[articleRow.title] = articleRow.article_id
      })
      const formattedComments = commentData.map(({ article_title, body, votes, author, created_at }) => {
        return [articleIdLookup[article_title], body, votes, author, new Date(created_at)];
      })
      const queryStr = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
        formattedComments
      );
      return db.query(queryStr)
    })
};
module.exports = seed;
