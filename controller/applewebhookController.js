import handleAppleWebhook from "../middleware/appleWebhookHandler.js";

const applewebhookController = {
    async applehook(req,res,next) {
        try {
            const notification = req.body;
            await handleAppleWebhook(notification);
            res.json({message: "fdfd"});
          } catch (error) {
            console.error(error);
            res.json({message: "error"});
          }
    }
}

export default applewebhookController;