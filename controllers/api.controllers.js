const endpoints = require("../endpoints.json");

//console.log(endpoints, ">> endpoints in controller")

exports.getEndpoints = (request, responce) => {
    responce.status(200).send({ endpoints: endpoints })
};

