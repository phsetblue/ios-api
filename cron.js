import { UserSchema } from './schema/index.js'; // Assuming the user model is defined in the 'models/user.js' file
import { CronJob } from 'cron';
import { connectDB } from "./database/index.js";
connectDB();

const checkExpiredTrials = async () => {
  try {
    const currentDate = new Date();

    // Find users with trial subscriptions that have expired
    const expiredTrialUsers = await UserSchema.find(
      { 
        'subscription.status': 'trial', 
        'subscription.trialEnd': { $lte: currentDate } 
      }
    );
    for (let user of expiredTrialUsers) {
      user.subscription.status = 'expired';
      user.subscription.subscriptionWarning = true;
      user.subscription.subscriptionMessage = 'Your trial subscription has expired. Please buy a subscription to continue using our service.';
      await user.save();
      console.log('User trial subscription expired:', user);
    }

    // Find trial users that have less than 1 day remaining
    const warningTrialUsers = await UserSchema.find(
      { 
        'subscription.status': 'trial', 
        'subscription.trialEnd': { $gt: currentDate, $lte: new Date(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000)) } 
      }
    );
    for (let user of warningTrialUsers) {
      user.subscription.subscriptionWarning = true;
      user.subscription.subscriptionMessage = `Your trial subscription will expire in 1 day.`;
      await user.save();
      console.log('User trial subscription warning:', user);
    }

    // Find subscribed users that have expired
    const expiredSubscribedUsers = await UserSchema.find(
      { 
        'subscription.status': 'subscribed', 
        'subscription.subscriptionEnd': { $lte: currentDate } 
      }
    );
    for (let user of expiredSubscribedUsers) {
      user.subscription.status = 'expired';
      user.subscription.subscriptionWarning = true;
      user.subscription.subscriptionMessage = 'Your subscription has expired. Please renew your subscription to continue using our service.';
      await user.save();
      console.log('User subscription expired:', user);
    }

    // Find subscribed users that have less than 30 days remaining
    const warningSubscribedUsers = await UserSchema.find(
      { 
        'subscription.status': 'subscribed', 
        'subscription.subscriptionEnd': { $gt: currentDate, $lte: new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)) } 
      }
    );
    for (let user of warningSubscribedUsers) {
      user.subscription.subscriptionWarning = true;
      const daysRemaining = Math.ceil((user.subscription.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24));
      user.subscription.subscriptionMessage = `Your subscription will expire in ${daysRemaining} days.`;
      await user.save();
      console.log('User subscription warning:', user);
    }
  } catch (err) {
    console.log(err);
  }
};

const job = new CronJob('0 0 * * * *', checkExpiredTrials); // Run every hour

job.start();
