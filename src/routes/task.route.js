import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTasksByTag,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/create").post(verifyJWT, createTask)
router.route("/fetch-all").get(verifyJWT, getAllTasks)
router.route("/fetch-by-tag").get(verifyJWT, getTasksByTag)
router.route("/update/:taskId").patch(verifyJWT, updateTask)
router.route("/delete/:taskId").delete(verifyJWT, deleteTask)


export default router