const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgresDBConfig');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM('admin', 'customer', 'agent'),
    },
    otp: {
        type: DataTypes.STRING,
    },
    otpExpiry: {
        type: DataTypes.DATE,
    },
    otpSentAt: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
    tableName: 'users',
});

module.exports = User;