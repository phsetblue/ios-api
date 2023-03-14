import express from "express";
import jws from 'jws';
import { loginController, refreshController, registerController, redirectController, setdetailsController, getdetailsController, subscriptionController, applewebhookController, deleteController } from "../controller/index.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerController.register);
router.post("/updatedetails", registerController.updatedetails);

/* user share the details of what to show */
router.post("/share_details", setdetailsController.setdetails);
router.post("/login", loginController.login);
router.post("/refreshtoken", refreshController.refresh);
router.post("/logout", [auth], loginController.logout);
router.post("/userdetails", getdetailsController.details);
router.get("/content/:id", redirectController.in);
router.post("/buysubscription", subscriptionController.buy);
router.post("/applewebhook", applewebhookController.applehook);
router.post('/delete', deleteController.delete);
router.get('/delete-account/:deleteAccountToken', deleteController.deleteAccount);

router.post('/decode', (req, res) => {
    // const { jwsSignature } = req.body;
    try {
        const decoded = jws.decode(req.body.signedPayload);
        const payload = JSON.parse(decoded.payload);
        // console.log(payload);
        // console.log("sti - ", payload.data.signedTransactionInfo);
        // console.log("sri - ", payload.data.signedRenewalInfo);
        const sti = jws.decode(payload.data.signedTransactionInfo);
        payload.data.signedTransactionInfo = JSON.parse(sti.payload);
        const sri = jws.decode(payload.data.signedRenewalInfo);
        payload.data.signedRenewalInfo = JSON.parse(sri.payload);
        res.json(payload);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid JWS signature" });
    }
});


export default router;