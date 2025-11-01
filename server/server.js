import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import workSpaceRouter from './routes/workSpaceRoutes.js';
import { protect } from './middlewares/authMiddleware.js';
import projectRouter from './routes/projectRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('Server is running'));

app.use("/api/inngest", serve({ client: inngest, functions }));

// Import and use workspace routes
app.use('/api/workspaces', protect, workSpaceRouter);
app.use('/api/projects', protect, projectRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});