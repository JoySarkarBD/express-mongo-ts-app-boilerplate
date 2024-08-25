import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/config';

// Initialize server variable
let server: Server;

async function main() {
  try {
    // Start the server
    server = app.listen(config.PORT, () => {
      console.log(`Server running at http://localhost:${config.PORT}`);
    });

    // Connect to the database
    await mongoose.connect(config.DB_CONNECTION_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1); // Exit process if initialization fails
  }
}

// Run the main function
main();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Rejection:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
