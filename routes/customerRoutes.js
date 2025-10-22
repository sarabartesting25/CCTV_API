const express = require('express');
const router = express.Router();
const { registerCustomer, getCustomerByMobile, editCustomer, getAllCustomers, deleteCustomer, getCustomerById, getCustomerCount } = require('../controller/customerController');
const upload = require('../middleware/multer');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', protect, authorizeRoles('admin'), upload.single('photo'), registerCustomer);
router.get('/getCustomerByMobile', protect, authorizeRoles('admin', 'customer'), getCustomerByMobile);
router.put('/editCustomer/:id', protect, authorizeRoles('admin', 'customer'), upload.single('photo'), editCustomer);
router.get('/getAllCustomers', protect, authorizeRoles('admin'), getAllCustomers);
router.delete('/deleteCustomer/:id', protect, authorizeRoles('admin'), deleteCustomer);
router.get('/getCustomerById/:id', protect, authorizeRoles('admin', 'customer'), getCustomerById);
router.get('/getCustomerCount', protect, authorizeRoles('admin'), getCustomerCount);

module.exports = router;