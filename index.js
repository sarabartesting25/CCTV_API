const dotenv = require('dotenv');
const express = require('express');
const { sequelize }  = require('./config/postgresDBConfig');
const connectPostgresDB = require('./config/postgresDBConfig');

// Load environment variables from .env file
dotenv.config();

// connect to the database
connectPostgresDB();
sequelize.sync({ alter: true });

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));


//Import Routes
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const agentRoutes = require('./routes/agentRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const agentAssignmentRoutes = require('./routes/agentAssignmentRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/serviceRequest', serviceRequestRoutes);
app.use('/api/agentAssignment', agentAssignmentRoutes);

// start the server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

console.log("Hello World");