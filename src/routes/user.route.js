import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// //secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/change-password").patch(verifyJWT, changeCurrentPassword)
router.route("/profile").get(verifyJWT, getCurrentUser)
router.route("/update").patch(verifyJWT, updateAccountDetails)

export default router