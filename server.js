const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const db = require("./Config/connection");
require("dotenv").config();
app.use(cors(
    {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
    }
));

app.use(bodyParser.json({ limit: "16mb" }))
app.use(bodyParser.urlencoded({ limit: "16mb", extended: true, parameterLimit: 50000 }))

db.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.log('logging error');
    console.log(err);
});

require("./src/Routes/allRoutes")(app);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});