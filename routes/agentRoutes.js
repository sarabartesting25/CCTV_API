const express = require('express');
const router = express.Router();
const { registerAgent, getAgentByMobile, editAgentDetails, getAllAgents, deleteAgent, getAgentById, updateAgentSalary, getAgentCount } = require('../controller/agentController');
const upload = require('../middleware/multer');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', protect, authorizeRoles('admin'), upload.single('photo'), registerAgent);
router.get('/getAgentByMobile', protect, authorizeRoles('admin', 'agent'), getAgentByMobile);
router.put('/editAgent/:id', protect, authorizeRoles('admin', 'agent'), upload.single('photo'), editAgentDetails);
router.get('/getAllAgents', protect, authorizeRoles('admin'), getAllAgents);
router.delete('/delete/:id', protect, authorizeRoles('admin'), deleteAgent);
router.get('/getAgentById/:id', protect, authorizeRoles('admin', 'agent'), getAgentById);
router.put('/updateSalary/:id', protect, authorizeRoles('admin'), updateAgentSalary);
router.get('/getAgentCount', protect, authorizeRoles('admin'), getAgentCount);

module.exports = router;