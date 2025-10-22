const User = require('../models/userModel');
const Customer = require('../models/customerModel');
const Agent = require('../models/agentModel');
const jwt = require('jsonwebtoken');
const { generateOtp, OTP_EXPIRATION_TIME, OTP_RESEND_INTERVAL } = require('../utils/otp');
const { sendOtpSms } = require('../utils/d7Sms');
const { sequelize } = require('../config/postgresDBConfig');



// Register a new user 
exports.registerUser = async (req, res) => {
    try {
        const { mobile, role } = req.body;
        let user = await User.findOne({ where: { mobile } });
        if (user) throw new Error('User already exists');
        user = await User.create({ mobile, role });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user       
exports.loginUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { mobile, otp } = req.body;
        const user = await User.findOne({ where: { mobile }, transaction });
        if (!user) throw new Error('User not found');
        if (user.otp !== otp) throw new Error('Invalid OTP');
        if (new Date() > user.otpExpiry) throw new Error('OTP expired');
        user.otp = null;
        user.otpExpiry = null;
        await user.save({ transaction });
        let profile = null;
        if (user.role === 'customer') {
            profile = await Customer.findOne({ where: { mobile }, transaction });
            if (!profile) throw new Error('Customer profile not found');
        } else if (user.role === 'agent') {
            profile = await Agent.findOne({ where: { mobile }, transaction });
            if (!profile) throw new Error('Agent profile not found');
        } else if (user.role === 'admin') {
            profile = { message: 'Admin profile - no additional data' };
        }
        await transaction.commit();
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.status(200).json({ message: 'Login successful', token, user, profile });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// OTP send or resend
exports.sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        const user = await User.findOne({ where: { mobile } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.otpSentAt && (Date.now() - new Date(user.otpSentAt).getTime()) < OTP_RESEND_INTERVAL) {
            const waitTime = Math.ceil((OTP_RESEND_INTERVAL - (Date.now() - new Date(user.otpSentAt).getTime())) / 1000);
            return res.status(400).json({ message: `OTP already sent. Please wait ${waitTime} seconds before requesting again.` });
        }
        // generate otp and save to user
        const otp = await generateOtp();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + OTP_EXPIRATION_TIME);
        user.otpSentAt = new Date();    
        await user.save();
        // send otp to SMS api
        // await sendOtpSms(mobile, otp);
        console.log(`OTP for ${mobile}: ${otp}`);
        // respond success with OTP (for testing purposes)
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all users 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
