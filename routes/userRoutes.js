const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, sendOtp } = require('../controller/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/sendOtp', sendOtp);
router.get('/getAllUsers', getAllUsers, protect, authorizeRoles('admin'));

module.exports = router;