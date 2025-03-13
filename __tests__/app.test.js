const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

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
  test("200: responds with an array of correctly formatted topic objects", () => {
    return request(app)
      .get("/api/topics")
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
        console.log(article, ">> article from test")
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
    4
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

