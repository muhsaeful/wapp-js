const { Sequelize, DataTypes } = require("sequelize");
const dbMysql = require("../database/sequelize_config");

const device = dbMysql.define('device', {
    device_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    device_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    session: {
        type: DataTypes.JSON,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    // timestamps: false
});

// wa_token.removeAttribute('id');
module.exports = device;