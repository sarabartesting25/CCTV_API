const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgresDBConfig');
const User = require('./userModel');

const Agent = sequelize.define('Agent', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isNumeric: true, len: [6, 6] },
    },
    photo: {
        type: DataTypes.STRING,
    },
    joiningDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { isDecimal: true },
    },
    userId: {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
    tableName: 'agents',
});

User.hasOne(Agent, { foreignKey: 'userId', onDelete: 'CASCADE' });
Agent.belongsTo(User, { foreignKey: 'userId' });

module.exports = Agent;