import express from 'express';

const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the classroom-backend server!' });
});

// Start server and log URL
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
