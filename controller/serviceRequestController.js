const ServiceRequest = require('../models/serviceRequestModel');
const cloudinary = require('../config/cloudinaryConfig');

// Create a new service request
exports.createServiceRequest = async (req, res) => {
    try {
        const { customerId, serviceType, description, alternativeMobile, location, scheduledDateAndTime } = req.body;
        const photos = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, { folder: 'service_request_photos' });
                photos.push(result.secure_url);
            }
        }
        const newRequest = await ServiceRequest.create({
            customerId, description, serviceType, alternativeMobile, location, scheduledDateAndTime, photos
        });
        const requestWithCustomer = await ServiceRequest.findByPk(newRequest.id, { include: ['Customer'] });
        res.status(201).json(requestWithCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// update the status of a service request
exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const request = await ServiceRequest.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        request.status = status;
        if (status === 'Completed') {
            request.completionDateAndTime = new Date();
        }
        await request.save();
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get all service requests for a customer
exports.getCustomerRequests = async (req, res) => {
    try {
        const { customerId } = req.params;
        const requests = await ServiceRequest.findAll({ where: { customerId }, include: ['Customer'] });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get all service requests (admin)
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.findAll( { include: ['Customer'] } );
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
