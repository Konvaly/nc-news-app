const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const articles = require("../db/data/test-data/articles");

/* Set up your beforeEach & afterAll functions here */
//Reseed the database before each test
beforeEach(() => {
  return seed(data)
})

//Close the DB connection after all test
afterAll(() => {
  return db.end()
})

/*TESTING*/
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

/*TASK-2*/

//   /api/topics
// 200: responds with an array of correctly formatted topic objects
// - Check length af the array of objects
// - Check that each attribute is of the data type I'm expecting

describe("GET /api/topics", () => {
  test("200: responds with an array of correctly formatted topics objects", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array)
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
            img_url: expect.any(String)
          })
        })
      })
  })
  test("404: responds with an error if path doesn't exist", () => {
    return request(app)
      .get('/api/nonexistent')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path")
      })
  })
})

/*TASK-3*/
//   /api/articles/article_id
describe("GET /api/articles/:article_id", () => {
  test("200: responds with a correctly formatted object of article", () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: responds with an error if article_id does not exist", () => {
    return request(app)
      .get('/api/articles/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      })
  })
  test("400: responds with 'Bad request' when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

/*TASK-4*/
//   /api/articles
// Responds with 200 OK.
// Returns an array of article objects.
// Each article object should have the correct properties.
// Articles should be sorted by created_at (descending).

describe("GET /api/articles", () => {
  test("200: responds with an array of correctly formatted article objects and articles should not include a body property", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(13);

        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");

          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
        })
      })
  })
  test("200: articles should be sorted by created_at in descending order", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        const sortedArticles = [...articles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        expect(articles).toEqual(sortedArticles)
      })
  })
  test("404: responds with an error if path doesn't exist", () => {
    return request(app)
      .get('/api/nonexistent')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path")
      })
  })
})

/*TASK-5*/
///api/articles/:article_id/comments
//Responds with: an array of comments for the given article_id of which 
// each comment should have the following properties: comment_id, votes, 
// created_at, author, body, article_id
//Comments should be served with the most recent comments first.

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for a valid article_id", () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);

        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1
          })
        })
      })
  })
  test("404: responds with 'Article not found' when article_id doesn't exist", () => {
    return request(app)
      .get('/api/articles/9999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
  test("400: responds with 'Invalid article ID' when given an invalid article_id", () => {
    return request(app)
      .get('/api/articles/not-an-id/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid article ID" });
      });
  });
  test("200: responds with an empty array when article exists but has no comments", () => {
    return request(app)
      .get('/api/articles/2/comments') // assuming article_id:2 exists but has no comments
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
})
