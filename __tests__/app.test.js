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
})
