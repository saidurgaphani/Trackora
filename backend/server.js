require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

console.log('--- Startup Diagnostic ---');
console.log(`Node Version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log(`Has MONGO_URI: ${process.env.MONGO_URI ? 'Yes' : 'No'}`);
console.log(`Has JWT_SECRET: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
console.log('-------------------------');

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('FATAL ERROR DURING STARTUP:');
        console.error(error);
        process.exit(1);
    }
};

startServer();
