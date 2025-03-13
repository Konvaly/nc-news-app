exports.handleNonExistentEndpoint = (req, res, next) => {
    console.log("that endpoint doesn't exist")
    res.status(404).send({ msg: "Invalid path" })
}


exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.handleServerErrors = (err, req, res, next) => {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
    console.log(err);
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err);
    }
}
