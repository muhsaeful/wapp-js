const dbMysql = require("../database/sequelize_config");
const { Sequelize, DataTypes } = require("sequelize");
const query = dbMysql.getQueryInterface();

exports.tableWa_token = query.createTable('wa_token', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    session: {
        type: DataTypes.JSON,
        allowNull: false,
        unique: true
    }
});

this.tableWa_token.then(response => {
    console.log('create table success');
}).catch((error) => {
    console.log('create table failed');
})