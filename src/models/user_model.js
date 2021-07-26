const { Sequelize, DataTypes } = require("sequelize");
const dbMysql = require("../database/sequelize_config");

const user = dbMysql.define('user', {
    user_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: true,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
    }
}, {
    freezeTableName: true,
    timestamps: false
});

user.removeAttribute('id');
module.exports = user;