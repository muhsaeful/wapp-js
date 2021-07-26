const dbMysql = require("../sequelize_config");
const { Sequelize, DataTypes } = require("sequelize");
const query = dbMysql.getQueryInterface();

exports.device = query.createTable('device', {
    // device_id
    // user_id
    // device_phone
    // description
    // session
    // created_at
    // updated_at

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
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});

exports.user = query.createTable('user', {
    // user_id
    // username
    // password
    // email
    // created_at
    // updated_at

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
        allowNull: false,
        unique: false,
    },
    email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
});


// this.device.then(response => {
//     console.log('create table success');
// }).catch((error) => {
//     console.log(error);
//     console.log('create table failed');
// })

this.device.then(response => { });
this.user.then(response => { });