import express from "express";
import { addMember, creatProject, updateProject } from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post('/', creatProject)
projectRouter.put('/', updateProject)
projectRouter.post('/:projectId/addMember', addMember)

export default projectRouter;