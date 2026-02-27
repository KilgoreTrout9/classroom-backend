import express from 'express';
import subjectsRouter from './routes/subject';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

// Middleware to parse JSON
app.use(express.json());

app.use('/api/subjects', subjectsRouter)

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the classroom-backend server!' });
});

// Start server and log URL
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
