const { Sequelize, DataTypes } = require("sequelize");
const dbMysql = require("../database/sequelize_config");

const wa_token = dbMysql.define('wa_token', {
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
}, {
    freezeTableName: true,
    timestamps: false
});

// wa_token.removeAttribute('id');
module.exports = wa_token;