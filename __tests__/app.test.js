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

/*TASK-6*/
describe("POST /api/articles/:article_id/comments", () => {
  describe("201", () => {
    test("201: Successfully adds a comment and responds with the posted comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a great article!"
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            body: newComment.body,
            article_id: 1,
            author: newComment.username,
            votes: 0, // New comments should have 0 votes
            created_at: expect.any(String)
          });
        });
    });
    test("201: Ignores extra properties in request body and still adds the comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a great article!",
        extraProperty: "This should be ignored",
        anotherExtra: 123
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            body: newComment.body,
            article_id: 1,
            author: newComment.username,
            votes: 0,
            created_at: expect.any(String)
          });

          expect(body.comment).not.toHaveProperty("extraProperty");
          expect(body.comment).not.toHaveProperty("anotherExtra");
        });
    });
  })
  describe("400", () => {
    test("400: Responds with an error when username is missing", () => {
      const newComment = {
        body: "This is a great article!"
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Missing required fields" })
        })
    })
    test("400: Responds with an error when body is missing", () => {
      const newComment = {
        username: "butter_bridge"
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Missing required fields" })
        })
    })
    test("400: Responds with an error when both fields are missing", () => {
      const newComment = {};

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Missing required fields" })
        })
    })
    test("400: responds with an error when article_id is not a number", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a great article!"
      };

      return request(app)
        .post("/api/articles/not-a-number/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Invalid article ID" })
        })
    })
  })
  describe("404", () => {
    test("404: Responds with an error when article_id doesn't exist", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a great article!"
      };

      return request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Article not found" })
        })
    })
    test("404: Responds with an error when username does not exist", () => {
      const newComment = {
        username: "non_existent_user",
        body: "What's the mess here!"
      }

      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "User not found" })
        })
    })
  })
});

/*TASK-7*/
describe("PATCH /api/articles/:article_id", () => {
  describe("200", () => {
    test("200: should update article votes and return the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            votes: expect.any(Number),
          });
          expect(body.article.votes).toBe(101); // Assuming original votes = 100
        });
    });
    test("200: should decrease article votes and return the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            votes: expect.any(Number)
          });
          expect(body.article.votes).toBe(99); // Assuming original votes = 100
        });
    });

  })
  describe("400", () => {
    test("400: should return an error when article_id is invalid", () => {
      return request(app)
        .patch('/api/articles/not-a-number')
        .send({ inc_votes: 1 }) // valid body
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Invalid article ID" })
        })
    })
    test("400: should return an error when inc_votes field is missing", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({}) // No inc_votes field
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Missing required fields" });
        });
    });
    test("400: should return an error when inc_votes is not a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "not_a_number" }) // Invalid inc_votes value
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Invalid value for inc_votes" });
        });
    });

  })
  describe("404", () => {
    test("404: returns an error when article_id doesn't exist", () => {
      return request(app)
        .patch('/api/articles/9999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Article not found" })
        })
    })
  })
});
