const handleNonExistentEndpoint = (request, response, next) => {
    console.log("that endpoint doesn't exist")
    response.status(404).send({ msg: "Invalid path" })
}


const handleCustomErrors = (err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

const handleServerErrors = (err, request, response, next) => {
    console.error(err);
    response.status(500).send({ msg: "Internal Server Error" });
};

module.exports = {
    handleNonExistentEndpoint,
    handleCustomErrors,
    handleServerErrors
};