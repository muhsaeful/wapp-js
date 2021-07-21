const dbMysql = require("../database/sequelize_config");
const { Sequelize, DataTypes } = require("sequelize");
const query = dbMysql.getQueryInterface();

exports.tableWa_token = query.createTable('wa_token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    session: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    }
});

this.tableWa_token.then(response => {
    console.log('create table success');
}).catch((error) => {
    console.log('create table failed');
})