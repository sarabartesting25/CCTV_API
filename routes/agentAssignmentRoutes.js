const express = require('express');
const router = express.Router();
const agentAssignmentController = require('../controller/AgentAssignmentController');
const { assignAgent, updateAssignmentStatus, getAgentAssignments, getAllAssignments } = agentAssignmentController;
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/assignAgent', protect, authorizeRoles('admin'), assignAgent);
router.put('/updateStatus', protect, authorizeRoles('admin'), updateAssignmentStatus);
router.get('/getByAgentId/:agentId', protect, getAgentAssignments);
router.get('/getAllAssignments', protect, authorizeRoles('admin'), getAllAssignments);

module.exports = router;