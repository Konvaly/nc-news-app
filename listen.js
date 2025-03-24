const app = require("./app");

// app.listen(8080, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("app listening on 8080")
//     }
// })
const { PORT = 8080 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app;