import { Router } from "express";
import {
    createTag,
    getAllTags,
    updateTag,
    deleteTag,
} from "../controllers/tag.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/create").post(verifyJWT, createTag)
router.route("/fetch-all").get(verifyJWT, getAllTags)
router.route("/update/:tagId").patch(verifyJWT, updateTag)
router.route("/delete/:tagId").delete(verifyJWT, deleteTag)


export default router