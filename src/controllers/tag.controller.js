import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tag } from "../models/tag.model.js";
import { Task } from "../models/task.model.js";


const createTag = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const createdBy = req.user.id;

  const existedTag = await Tag.findOne({ name:name, createdBy:req.user.id });

  if(existedTag){
    throw new ApiError(409, "Tag with this name already exists");
  }

  const tag = new Tag({
    name,
    description,
    createdBy,
  });

  await tag.save();
  return res
    .status(200)
    .json(new ApiResponse(200, tag, "Tag Created Successfully"));
});

const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find({ createdBy: req.user.id });
  return res
    .status(200)
    .json(new ApiResponse(200, tags, "Tag Fetched Successfully"));
});

const updateTag = asyncHandler(async (req, res) => {

  const tag = await Tag.findById(req.params.tagId);
  if (tag.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized");
  }
  
  const { name, description } = req.body;

  const existedTag = await Tag.findOne({name:name, createdBy: req.user.id});
  if(existedTag){
    throw new ApiError(409, "Tag with this name already exists");
  }

  const updatedFields = { name, description };  
  const filteredFields = Object.fromEntries(
    Object.entries(updatedFields).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  
  Object.assign(tag, filteredFields);
  await tag.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tag, "Tag Updated Successfully"));
});

const deleteTag = asyncHandler(async (req, res) => {

  const tag = await Tag.findById(req.params.tagId);
  if (tag.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized");
  }
  
  const existedTask = await Task.findOne({ tag:req.params.tagId });
  if(existedTask){
    throw new ApiError(409, "The tag is referenced by some tasks");
  }

  await Tag.deleteOne({ _id: req.params.tagId });
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tag Deleted Successfully"));
});

export { createTag, getAllTags, updateTag, deleteTag };