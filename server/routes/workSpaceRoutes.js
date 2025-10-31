import express from 'express';
import { getUserWorkspaces, addMember } from '../controllers/workspaceController.js';

const workSpaceRouter = express.Router();

workSpaceRouter.get('/', getUserWorkspaces);
workSpaceRouter.post('/add-member', addMember);

export default workSpaceRouter;