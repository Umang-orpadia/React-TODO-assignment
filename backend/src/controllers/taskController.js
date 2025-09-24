import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user.id });
  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
  const tasks = req.user.role === "admin"
    ? await Task.find()
    : await Task.find({ user: req.user.id });
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  await task.deleteOne();
  res.json({ msg: "Task deleted" });
};
