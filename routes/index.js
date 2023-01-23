import express from "express";
import { loginController, refreshController, registerController } from "../controller/index.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register",registerController.register);
/* user share the details of what to show */
// router.post('/share_details, setdetailsController.setdetails); 
router.post("/login",loginController.login);
router.post("/refreshtoken",refreshController.refresh);
router.post("/logout",[auth],loginController.logout);
// router.get('/:id', ) // user base api

export default router;