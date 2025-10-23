const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controller/serviceRequestController');
const upload = require('../middleware/multer');
const { createServiceRequest, updateRequestStatus, getCustomerRequests, getAllRequests } = serviceRequestController;
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/createRequest', protect, upload.array('photos', 5), createServiceRequest);
router.put('/updateStatus/:id', protect, authorizeRoles('admin'), updateRequestStatus);
router.get('/getByCustomerId/:customerId', protect, getCustomerRequests);
router.get('/getAllRequests', protect, authorizeRoles('admin'), getAllRequests);

module.exports = router;