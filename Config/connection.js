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
db.methodMappingModel = require('../src/Models/methodMappingModel')(
    sequelize,
    Sequelize
);
db.subjectsModel = require('../src/Models/subjectsModel')(
    sequelize,
    Sequelize
);
db.chaptersModel = require('../src/Models/chaptersModel')(
    sequelize,
    Sequelize
);
db.topicsModel = require('../src/Models/topicsModel')(
    sequelize,
    Sequelize
);
db.videosModel = require('../src/Models/videosModel')(
    sequelize,
    Sequelize
);
db.notesModel = require('../src/Models/notesModel')(
    sequelize,
    Sequelize
);
db.historyModel = require('../src/Models/historyModel')(
    sequelize,
    Sequelize
);
db.paymentsModel = require('../src/Models/paymentsModel')(
    sequelize,
    Sequelize
);
db.testsModel = require('../src/Models/testsModel')(
    sequelize,
    Sequelize
);
db.testsHistoryModel = require('../src/Models/testHistoryModel')(
    sequelize,
    Sequelize
);
db.questionsModel = require('../src/Models/questionsModel')(
    sequelize,
    Sequelize
);
db.taskModel = require('../src/Models/taskModel')(
    sequelize,
    Sequelize
);
module.exports = db;
