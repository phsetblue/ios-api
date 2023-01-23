import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{ type: String, trim: true, required: true, default: null },
    userName:{ type: String, trim: true, required: true, default: null },
    email: { type: String, trim: true, required: true, default: null },
    password: { type: String, trim: true, required: true, default: null },
    phoneNumber: { type: Number, trim: true, required: true, default: null },
    role: { type: String, trim: true, default: "user" },
    // share_email : {type: String, trim: true, required: true, default: null},
    // share_whatsapp : {type: String, trim: true, required: true, default: null},
    share_android : {type: String, trim: true, required: false, default: null},
    share_ios : {type: String, trim: true, required: false, default: null}
},{
    timestamps: true
});

export default mongoose.model('User', userSchema , 'users');