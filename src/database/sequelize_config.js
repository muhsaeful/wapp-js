const Sequelize = require("sequelize");
require("dotenv").config();

var dbMysql = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PWD}`, {
    host: `${process.env.DB_SRV}`,
    dialect: 'mysql'
});

(async function () {
    try {
        await dbMysql.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.code);
    }

})()

module.exports = dbMysql;