import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{ type: String, trim: true, required: true, default: null },
    userName:{ type: String, trim: true, required: true, default: null },
    email: { type: String, trim: true, required: true, default: null },
    password: { type: String, trim: true, required: true, default: null },
    phoneNumber: { type: Number, trim: true, required: true, default: null },
    role: { type: String, trim: true, default: "user" },
    baseUrl: {type: String, trim: true, required: false, default: null},
    what_share: {type: String, trim: true, required: false, default: null},
    share_value: {type: String, trim: true, required: false, default: null}
    // share_redirect: {type: String, trim: true, required: false, default: null}
},{
    timestamps: true
});

export default mongoose.model('User', userSchema , 'users');