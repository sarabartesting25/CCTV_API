const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgresDBConfig');
const Agent = require('./agentModel');
const ServiceRequest = require('./ServiceRequestModel');

const AgentAssignment = sequelize.define('AgentAssignment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    requestId: {
        type: DataTypes.UUID,
        references: { model: 'service_requests', key: 'id' },
        allowNull: false,
    },
    agentId: {
        type: DataTypes.UUID,
        references: { model: 'agents', key: 'id' },
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('assigned', 'accepted', 'rejected'),
        defaultValue: 'assigned',
        allowNull: false,
    },
    rejectReason: {
        type: DataTypes.ENUM('reschedule', 'not interested'),
        allowNull: true,
    },
    rejectDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rescheduleDateAndTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'agent_assignments',
});

Agent.hasMany(AgentAssignment, { foreignKey: 'agentId' });
AgentAssignment.belongsTo(Agent, { foreignKey: 'agentId' });

ServiceRequest.hasMany(AgentAssignment, { foreignKey: 'requestId' });
AgentAssignment.belongsTo(ServiceRequest, { foreignKey: 'requestId' });

module.exports = AgentAssignment;
