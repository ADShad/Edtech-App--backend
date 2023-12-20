require("dotenv").config();
module.exports = {
    HOST: process.env.DBHOST,
    PORT: process.env.DBPORT,
    USER: process.env.DBUSER,
    PASSWORD: process.env.DBPASSWORD,
    DB: process.env.DBNAME,
    dialect: "mysql",
    dialectOptions: {
        options: {
            requestTimeout: 30000,
        },
    },
    pool: {
        max: 65,
        min: 20,
        acquire: 30000,
        idle: 10000,
    },
};
