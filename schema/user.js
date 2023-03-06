import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, trim: true, required: true, default: null },
    userName: { type: String, trim: true, required: true, default: null },
    email: { type: String, trim: true, required: true, default: null },
    password: { type: String, trim: true, required: true, default: null },
    phoneNumber: { type: Number, trim: true, required: true, default: null },
    role: { type: String, trim: true, default: "user" },
    baseUrl: { type: String, trim: true, required: false, default: null },
    what_share: { type: String, trim: true, required: false, default: null },
    share_value: { type: String, trim: true, required: false, default: null },
    updateWarning: { type: Boolean, default: false },
    updateMessage: { type: String, default: null },
    subscription: {
        appleStatus: {
            type: String
        },
        appleSubType: {
            type: String
        },
        subscriptionWarning: {
            type: Boolean,
            default: false
        },
        subscriptionMessage: {
            type: String,
            default: null
        },
        remainingDays: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['trial', 'subscribed', 'expired'],
            default: 'trial'
        },
        trialStart: {
            type: Date,
            default: Date.now
        },
        trialEnd: {
            type: Date,
            default: function () {
                const trialStart = this.get('subscription.trialStart').getTime();
                const trialEnd = trialStart + 3 * 24 * 60 * 60 * 1000;
                return new Date(trialEnd);
            }
        },
        transactionId: {
            type: String
        },
        originalTransactionId: {
            type: String
        },
        subscriptionStart: {
            type: Date
        },
        subscriptionEnd: {
            type: Date
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema, 'users');