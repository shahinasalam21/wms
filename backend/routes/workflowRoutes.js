import express from "express";
import { createWorkflow, getAllWorkflows } from "../models/workflow.js";

const router = express.Router();

// to crreate workflow
router.post("/create", async (req, res) => {
  const { name, description, manager_id } = req.body;
  try {
    const workflow = await createWorkflow(name, description, manager_id);
    res.status(201).json({ message: "Workflow created successfully", workflowId: workflow.id, });
  } catch (error) {
    console.error("Error creating workflow:", error);
    res.status(500).json({ error: "Server error while creating workflow" });
  }
});
 // Get workflows for a specific manager
router.get("/manager/:managerId", async (req, res) => {
  const { managerId } = req.params;
  try {
    const workflows = await getAllWorkflows(managerId);
    res.status(200).json(workflows);
  } catch (error) {
    console.error("Error fetching workflows for manager:", error);
    res.status(500).json({ error: "Server error while fetching manager workflows" });
  }
});
//
//


export default router;

