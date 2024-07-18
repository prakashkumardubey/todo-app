import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(async (req, res) => {
  let { title, description, dueDate, priority, tag } = req.body;
  const createdBy = req.user.id;

  if(!dueDate)dueDate = undefined;
  else dueDate = new Date(dueDate);
  //  "YYYY-MM-DD" or "MM/DD/YYYY"

  const createFields = {
    title,
    description,
    priority,
    dueDate,
    createdBy,
    tag,
  };

  const filteredFields = Object.fromEntries(
    Object.entries(createFields).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  const task = new Task(filteredFields);

  await task.save();

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task Created Successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.id });
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task Fetched Successfully"));
});

const getTasksByTag = asyncHandler(async (req, res) => {

  const tasks = await Task.find({
    createdBy: req.user.id,
    tag: req.params.tagId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task Fetched Successfully"));
});

const updateTask = asyncHandler(async (req, res) => {

  const task = await Task.findById(req.params.taskId);
  if (task.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized");
  }

  let { title, description, priority,dueDate, status, tag } = req.body;

  if(!dueDate)dueDate = undefined;
  else dueDate = new Date(dueDate);

  const updatedFields = {
    title,
    description,
    priority,
    status,
    dueDate,
    tag,
  };

  const filteredFields = Object.fromEntries(
    Object.entries(updatedFields).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  );

  Object.assign(task, filteredFields);
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Updated Successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {

  const task = await Task.findById(req.params.taskId);
  if (task.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized");
  }
  
  await Task.deleteOne({ _id: req.params.taskId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task Deleted Successfully"));
});

export { createTask, getAllTasks, getTasksByTag, updateTask, deleteTask };
