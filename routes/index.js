import express from "express";
import { loginController, refreshController, registerController, redirectController, setdetailsController, getdetailsController, subscriptionController, applewebhookController } from "../controller/index.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register",registerController.register);
router.post("/updatedetails", registerController.updatedetails);

/* user share the details of what to show */
router.post("/share_details", setdetailsController.setdetails); 
router.post("/login",loginController.login);
router.post("/refreshtoken",refreshController.refresh);
router.post("/logout",[auth],loginController.logout);
router.post("/userdetails", getdetailsController.details);
router.get("/content/:id", redirectController.in);
router.post("/buysubscription", subscriptionController.buy);
router.post("/applewebhook", applewebhookController.applehook);


export default router;