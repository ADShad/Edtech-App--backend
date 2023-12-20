const dbConfig = require("./dbconfig");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});
// console.log(sequelize);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usersModel = require('../src/Models/usersModel')(
    sequelize,
    Sequelize
);
db.courseMappingModel = require('../src/Models/courseMappingModel')(
    sequelize,
    Sequelize
);
db.paymentsModel = require('../src/Models/paymentsModel')(
    sequelize,
    Sequelize
);
module.exports = db;
