const app = require("./app");

app.listen(8080, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("app listening on 8080")
    }
})

module.exports = app;