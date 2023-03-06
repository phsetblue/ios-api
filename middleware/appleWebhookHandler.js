import express from 'express';
import jws from 'jws';
import bodyParser from 'body-parser';
import { UserSchema } from '../schema/index.js'; // Assuming the user model is defined in the 'models/user.js' file
import { connectDB } from "../database/index.js";
import { FileSchema } from '../schema/index.js';
import fs from 'fs';
// import path from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());


function decodeJWSPayload(signedPayload) {
  try {
    const decoded = jws.decode(signedPayload);
    const payload = JSON.parse(decoded.payload);
    const sti = jws.decode(payload.data.signedTransactionInfo);
    payload.data.signedTransactionInfo = JSON.parse(sti.payload);
    const sri = jws.decode(payload.data.signedRenewalInfo);
    payload.data.signedRenewalInfo = JSON.parse(sri.payload);
    return payload;
  } catch (error) {
    console.error(error);
    throw new Error('Invalid JWS signature');
  }
}

connectDB();

const handleAppleWebhook = async (req, res, next) => {
  try {
    // console.log(req);
    const notification = req;
    // console.log(notification);

    // Log the data received by the API to a file
    // const logFilePath = path.join(__dirname, '../logs/applelog.txt');
    // const logData = `[${new Date().toISOString()}] ${JSON.stringify(notification)}\n`;

    // if (!fs.existsSync(logFilePath)) {
    //   // If log file doesn't exist, create it and write the data
    //   fs.writeFileSync(logFilePath, logData);
    // } else {
    //   // If log file exists, append the data to the end of the file
    //   fs.appendFileSync(logFilePath, logData);
    // }

    const decodedPayload = decodeJWSPayload(notification.signedPayload);

    // Log the data received by the API to a file
    // const logData = `[${new Date().toISOString()}]\n\n ${JSON.stringify(decodedPayload)}\n`;
    const logData = `\n\n\n\n[${new Date().toISOString()}]\n\n ${JSON.stringify(decodedPayload, null, 4)}\n`;


    const file = await FileSchema.findOne({ name: 'applelog.txt' });
    if (file) {
      // If file exists, append the data to the end of the file
      const updatedContent = file.content + `\n\n` + logData;
      await FileSchema.findByIdAndUpdate(file._id, { content: updatedContent });
    } else {
      // If file doesn't exist, create it and write the data
      const newFile = new FileSchema({ name: 'applelog.txt', content: logData });
      await newFile.save(); 
    }

    console.log('User subscription updated:');

    /*

    // Verify the request is from Apple
    const isAuthentic = verifyAppleSignature(req.headers['x-apple-signature'], JSON.stringify(req.body), 'YOUR_APPLE_SHARED_SECRET');
    if (!isAuthentic) {
      console.log('Request not from Apple.');
      res.sendStatus(401);
      return;
    }

    // Find the user associated with the notification
    const user = await UserSchema.findOne({ 'subscription.appleProductId': notification.auto_renew_product_id });

    if (!user) {
      console.log('User not found for Apple notification:', notification);
      res.sendStatus(200);
      return;
    }

    // Update the user's subscription status based on the notification type
    // also write the 
    switch (notification.notification_type) {
      case 'CANCEL': {
        user.subscription.status = 'canceled';
        user.subscription.subscriptionWarning = true;
        user.subscription.subscriptionMessage = 'Your subscription has been canceled.';
        break;
      }
      case 'DID_CHANGE_RENEWAL_PREF': {
        user.subscription.renewalPref = notification.auto_renew_status === 'true';
        break;
      }
      case 'DID_CHANGE_RENEWAL_STATUS': {
        if (notification.auto_renew_status === 'false') {
          user.subscription.status = 'expired';
          user.subscription.subscriptionWarning = true;
          user.subscription.subscriptionMessage = 'Your subscription has expired. Please renew your subscription to continue using our service.';
        }
        break;
      }
      case 'DID_FAIL_TO_RENEW': {
        user.subscription.status = 'expired';
        user.subscription.subscriptionWarning = true;
        user.subscription.subscriptionMessage = 'Your subscription has expired. Please renew your subscription to continue using our service.';
        break;
      }
      case 'INTERACTIVE_RENEWAL': {
        if (notification.auto_renew_status === 'true') {
          user.subscription.status = 'subscribed';
          user.subscription.subscriptionWarning = false;
          user.subscription.subscriptionMessage = '';
        }
        break;
      }
      case 'RENEWAL': {
        if (notification.auto_renew_status === 'false') {
          user.subscription.status = 'expired';
          user.subscription.subscriptionWarning = true;
          user.subscription.subscriptionMessage = 'Your subscription has expired. Please renew your subscription to continue using our service.';
        }
        break;
      }
      default: {
        console.log('Unknown notification type:', notification.notification_type);
        break;
      }
    }

    // Save the updated user record
    await user.save();


    */

    // console.log('User subscription updated:', user);
    // console.log('User subscription updated:');




    res.json({ "message": "done" });
  } catch (err) {
    console.log(err);
    res.json({ "message": "not" });
  }
};

export default handleAppleWebhook;
