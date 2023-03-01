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
    // register_date: {type: Date, trim: true, required: true},
    subscription: {
        subscriptionWarning: {
            type: Boolean,
            default: false
        },
        subscriptionMessage: {
            type: String,
            default: null
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
        planName: {
            type: String,
            required: false
        },
        planDetails: {
            type: String,
            required: false
        },
        planPrice: {
            type: Number,
            required: false
        },
        planDays: {
            type: Number,
            required: false
        },
        subscriptionStart: {
            type: Date
        },
        subscriptionEnd: {
            type: Date
        }
    }
    // share_redirect: {type: String, trim: true, required: false, default: null}
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema, 'users');