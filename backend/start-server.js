// Simple script to test if the server can start
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  
  // Close the server after 5 seconds for testing purposes
  setTimeout(() => {
    console.log('✅ Server started successfully!');
    process.exit(0);
  }, 5000);
});