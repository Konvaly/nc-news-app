const topics = require("../db/data/test-data/topics");
const fetchTopics = require("../models/topics.models");

const getTopics = (request, response) => {
    fetchTopics().then((topics) => {
        response.status(200).send({ topics: topics })
    })
}

module.exports = getTopics;