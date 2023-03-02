import handleAppleWebhook from "../middleware/appleWebhookHandler.js";

const applewebhookController = {
    async applehook(req,res,next) {
        try {
            const notification = req.body;
            await handleAppleWebhook(notification);
            res.sendStatus(200);
          } catch (error) {
            console.error(error);
            res.sendStatus(500);
          }
    }
}

export default applewebhookController;