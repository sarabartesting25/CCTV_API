const AgentAssignment = require('../models/AgentAssignmentModel');
const ServiceRequest = require('../models/serviceRequestModel');

// Assign an agent to a service request
exports.assignAgent = async (req, res) => {
    try {
        const { requestId, agentId } = req.body;
        const newAssignment = await AgentAssignment.create({ requestId, agentId });
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update the status of an agent assignment
exports.updateAssignmentStatus = async (req, res) => {
    try {
        const { id: assignmentId } = req.params;
        const { status, rejectReason, rejectDescription, rescheduleDateAndTime } = req.body;
        const assignment = await AgentAssignment.findByPk(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Agent assignment not found' });
        }
        assignment.status = status;
        // if accepted update service request status as in progress
        if (status === 'accepted') {
            const request = await ServiceRequest.findByPk(assignment.requestId);
            if (request) {
                request.status = 'in progress';
                await request.save();
            }
        }
        // Handle rejection details
        if (status === 'rejected') {
            assignment.rejectReason = rejectReason;
            assignment.rejectDescription = rejectDescription;
            assignment.rescheduleDateAndTime = rescheduleDateAndTime;
        }
        await assignment.save();
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all assignments for a specific agent with request details
exports.getAgentAssignments = async (req, res) => {
    try {
        const { agentId } = req.params;
        const assignments = await AgentAssignment.findAll({
            where: { agentId }, 
            include: ['ServiceRequest']
        });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all assignments (admin) with request and agent details
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await AgentAssignment.findAll({ include: ['ServiceRequest', 'Agent'] });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};
