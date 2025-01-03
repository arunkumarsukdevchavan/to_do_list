const express = require("express");
const Task = require("../model/Task");
const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Add a task
router.post("/", async (req, res) => {
    try {
        const { description, priority } = req.body;
        const newTask = new Task({ description, priority });
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Update a task
router.put("/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete a task
router.delete("/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
