import { UserSchema } from '../schema/index.js'; // Assuming the user model is defined in the 'models/user.js' file
import { connectDB } from "../database/index.js";
import fs from 'fs';
import path from 'path';

connectDB();

const handleAppleWebhook = async (req, res) => {
  try {
    const notification = req.body;

    // Log the data received by the API to a file
    const logFilePath = path.join(__dirname, '../logs/applelog.txt');
    const logData = `[${new Date().toISOString()}] ${JSON.stringify(notification)}\n`;

    if (!fs.existsSync(logFilePath)) {
      // If log file doesn't exist, create it and write the data
      fs.writeFileSync(logFilePath, logData);
    } else {
      // If log file exists, append the data to the end of the file
      fs.appendFileSync(logFilePath, logData);
    }

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
    console.log('User subscription updated:', user);

    

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const verifyAppleSignature = (signature, payload, secret) => {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('base64');
  return hash === signature;
};

export default handleAppleWebhook;
