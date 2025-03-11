const endpoints = require("../endpoints.json");

function getEndpoints(request, responce) {
    responce.status(200).send({ endpoints })
};

module.exports = getEndpoints;