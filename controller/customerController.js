const Customer = require('../models/customerModel');
const User = require('../models/userModel');
const cloudinary = require('../config/cloudinaryConfig');
const { sequelize } = require('../config/postgresDBConfig'); 

// Register a new customer
exports.registerCustomer = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { mobile, name, email, address, district, pincode, role='customer' } = req.body;
        let photoUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                { folder: 'customer_photos' }
            );
            photoUrl = result.secure_url;
        }
        let user = await User.findOne({ where: { mobile }, transaction });
        if (user) throw new Error('User already exists');
        user = await User.create({ mobile, role }, { transaction });
        const newCustomer = await Customer.create({
            userId: user.id, name, email, address, district, pincode, photo: photoUrl, mobile
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Customer registered successfully', customer: newCustomer });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// getCustomerByMobile
exports.getCustomerByMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        const customer = await Customer.findOne({ where: { mobile } });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// edit customer details
exports.editCustomer = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { mobile, name, email, address, district, pincode } = req.body;
        let photoUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                { folder: 'customer_photos' }
            );
            photoUrl = result.secure_url;
        }
        const customer = await Customer.findByPk(req.params.id, { transaction });
        if (!customer) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Customer not found' });
        }
        customer.mobile = mobile || customer.mobile;
        // change mobile in user table
        const user = await User.findByPk(customer.userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Associated user not found' });
        }
        user.mobile = mobile || user.mobile;
        await user.save({ transaction });
        customer.name = name || customer.name;
        customer.email = email || customer.email;
        customer.address = address || customer.address;
        customer.district = district || customer.district;
        customer.pincode = pincode || customer.pincode;
        if (photoUrl) customer.photo = photoUrl;
        await customer.save({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Customer updated successfully', customer });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json({ customers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// delete customer
exports.deleteCustomer = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const customer = await Customer.findByPk(req.params.id, { transaction });       
        if (!customer) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Customer not found' });
        }
        const user = await User.findByPk(customer.userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Associated user not found' });
        }
        await customer.destroy({ transaction });
        await user.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get customer by id
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get customer count
exports.getCustomerCount = async (req, res) => {
    try {
        const count = await Customer.count();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};

