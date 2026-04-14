// Ensure required env vars exist so config and models load during tests
if (!process.env.MONGO_URL) process.env.MONGO_URL = "mongodb://localhost:27017/test";
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "test-secret";
