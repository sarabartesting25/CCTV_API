const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgresDBConfig');
const Customer = require('./customerModel');

const ServiceRequest = sequelize.define('ServiceRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    customerId: {
        type: DataTypes.UUID,
        references: { model: 'customers', key: 'id' },
        allowNull: false,
    },
    serviceType: {
        type: DataTypes.ENUM('installation', 'repair', 'maintenance'),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    alternativeMobile: {
        type: DataTypes.STRING,
        validate: { isNumeric: true, len: [10, 15] },
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in progress', 'completed'),
        defaultValue: 'pending',
    },
    scheduledDateAndTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    completionDateAndTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'service_requests',
});

Customer.hasMany(ServiceRequest, { foreignKey: 'customerId' });
ServiceRequest.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = ServiceRequest;
