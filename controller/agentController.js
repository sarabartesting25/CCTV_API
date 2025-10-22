const Agent = require('../models/agentModel');
const User = require('../models/userModel');
const cloudinary = require('../config/cloudinaryConfig');
const { sequelize } = require('../config/postgresDBConfig');

// Register a new agent
exports.registerAgent = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { mobile, name, email, address, district, pincode, role='agent', salary } = req.body;
        const joiningDate = new Date();
        let photoUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                { folder: 'agent_photos' }
            );
            photoUrl = result.secure_url;
        }
        let user = await User.findOne({ where: { mobile }, transaction });
        if (user) throw new Error('User already exists');
        user = await User.create({ mobile, role }, { transaction });
        const newAgent = await Agent.create({
            userId: user.id, name, email, address, district, pincode, photo: photoUrl, mobile, joiningDate, salary
        }, { transaction });
        await transaction.commit();
        res.status(201).json({ message: 'Agent registered successfully', agent: newAgent });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// getAgentByMobile
exports.getAgentByMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        const agent = await Agent.findOne({ where: { mobile } });
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.status(200).json({ agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// edit agent details
exports.editAgentDetails = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { mobile, name, email, address, district, pincode } = req.body;
        let photoUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                { folder: 'agent_photos' }
            );
            photoUrl = result.secure_url;
        }
        const agent = await Agent.findByPk(req.params.id, { transaction });
        if (!agent) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Agent not found' });
        }
        agent.mobile = mobile || agent.mobile;
        const user = await User.findByPk(agent.userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Associated user not found' });
        }
        user.mobile = mobile || user.mobile;
        await user.save({ transaction });
        agent.name = name || agent.name;
        agent.email = email || agent.email;
        agent.address = address || agent.address;
        agent.district = district || agent.district;
        agent.pincode = pincode || agent.pincode;
        if (photoUrl) agent.photo = photoUrl;
        await agent.save({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Agent details updated successfully', agent });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get all agents
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await Agent.findAll();
        res.status(200).json({ agents });
    } catch (error) {  
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// delete agent
exports.deleteAgent = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const agent = await Agent.findByPk(req.params.id, { transaction });
        if (!agent) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Agent not found' });
        }
        const user = await User.findByPk(agent.userId, { transaction });
        if (user) {
            await user.destroy({ transaction });
        }
        await agent.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Agent deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get agent by id
exports.getAgentById = async (req, res) => {
    try {
        const agent = await Agent.findByPk(req.params.id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        res.status(200).json({ agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// update agent salary
exports.updateAgentSalary = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { salary } = req.body;
        const agent = await Agent.findByPk(req.params.id, { transaction });
        if (!agent) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Agent not found' });
        }
        agent.salary = salary;
        await agent.save({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Agent salary updated successfully', agent });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get agent count
exports.getAgentCount = async (req, res) => {
    try {
        const count = await Agent.count();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};