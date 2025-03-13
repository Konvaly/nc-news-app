const handleNonExistantEndpoint = (request, response, next) => {
    console.log("that endpoint doesn't exist")
    response.status(404).send({ msg: "Invalad path" })
}

module.exports = handleNonExistantEndpoint;