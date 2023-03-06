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
import { User } from '../model/index.js';

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

    const orgtrid = decodedPayload.data.signedTransactionInfo.originalTransactionId;
    const trid = decodedPayload.data.signedTransactionInfo.transactionId;
    const nottype = decodedPayload.notificationType;
    const notsubtype = decodedPayload.subtype;
    const purdate = decodedPayload.data.signedTransactionInfo.purchaseDate;
    const orgpurdate = decodedPayload.data.signedTransactionInfo.originalPurchaseDate;
    const expdate = decodedPayload.data.signedTransactionInfo.expiresDate;
    const signeddate = decodedPayload.data.signedTransactionInfo.signedDate;

    var tra_signeddate = new Date(signeddate);
    const sub_start = tra_signeddate
    tra_signeddate.setFullYear(tra_signeddate.getFullYear() + 1);
    const sub_end = tra_signeddate;


    var user = await UserSchema.findById({ originalTransactionId: orgtrid });

    if (user) {
      if (nottype === 'SUBSCRIBED') {
        user.subscription.appleStatus = nottype;
        user.subscription.appleSubType = notsubtype;
        user.subscription.status = "subscribed";
        user.subscription.subscriptionWarning = false;
        user.subscription.subscriptionMessage = "";
        user.subscription.transactionId = trid;
        user.subscription.subscriptionStart = sub_start;
        user.subscription.subscriptionEnd = sub_end;
        await user.save();
      } else if (nottype === 'DID_CHANGE_RENEWAL_STATUS') {
        if (notsubtype === 'AUTO_RENEW_DISABLED') {
          user.subscription.appleStatus = nottype;
          user.subscription.appleSubType = notsubtype;
          user.subscription.status = "expired";
          user.subscription.subscriptionWarning = true;
          user.subscription.subscriptionMessage = "Your subscription has expired. Please renew your subscription to continue using our service.";
          user.subscription.transactionId = trid;
          // user.subscription.subscriptionStart = sub_start;
          // user.subscription.subscriptionEnd = sub_end;
          await user.save();
        } else if (notsubtype === 'AUTO_RENEW_ENABLED') {
          user.subscription.appleStatus = nottype;
          user.subscription.appleSubType = notsubtype;
          user.subscription.status = "subscribed";
          user.subscription.subscriptionWarning = false;
          user.subscription.subscriptionMessage = "";
          user.subscription.transactionId = trid;
          user.subscription.subscriptionStart = sub_start;
          user.subscription.subscriptionEnd = sub_end;
          await user.save();
        }
      } else if (nottype === 'DID_RENEW') {
        user.subscription.appleStatus = nottype;
        user.subscription.appleSubType = notsubtype;
        user.subscription.status = "subscribed";
        user.subscription.subscriptionWarning = false;
        user.subscription.subscriptionMessage = "";
        user.subscription.transactionId = trid;
        user.subscription.subscriptionStart = sub_start;
        user.subscription.subscriptionEnd = sub_end;
        await user.save();
      } else if (nottype === 'EXPIRED') {
        user.subscription.appleStatus = nottype;
          user.subscription.appleSubType = notsubtype;
          user.subscription.status = "expired";
          user.subscription.subscriptionWarning = true;
          user.subscription.subscriptionMessage = "Your subscription has expired. Please renew your subscription to continue using our service.";
          user.subscription.transactionId = trid;
          await user.save();
      } else {
        console.log("not mandatory");
      }
    }

    console.log('User subscription updated:');
    res.json({ "message": "done" });
  } catch (err) {
    console.log(err);
    res.json({ "message": "not" });
  }
};

export default handleAppleWebhook;
