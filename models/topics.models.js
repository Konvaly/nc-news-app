const db = require("../db/connection")

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            return rows
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

module.exports = fetchTopics;


