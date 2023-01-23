import { UserSchema } from "../schema/index.js";

const user = {
    async isEmailExist(emaildata) {
        let totalDocs = await new Promise((resolve, reject) => {
            UserSchema.countDocuments({ email : emaildata }, (err, count) => {
                if (err) return reject(err);
                resolve(count);
            });
        });
        return (totalDocs > 0) ? true : false;
    },
    async isUsernameExist(usernamedata) {
        let totalDocs = await new Promise((resolve, reject) => {
            UserSchema.countDocuments({ userName: usernamedata }, (err, count) => {
                if (err) return reject(err);
                resolve(count);
            });
        });
        return (totalDocs > 0) ? true : false;
    },
    async isPhoneNumberExist(phone) {
        let totalDocs = await new Promise((resolve, reject) => {
            UserSchema.countDocuments({ phoneNumber: phone }, (err, count) => {
                if (err) return reject(err);
                resolve(count);
            });
        });
        return (totalDocs > 0) ? true : false;
    },
    async create(payload) {
        try{
            const document = await new UserSchema(payload);
            document = await document.save();
            return document;
        }catch(err){
            return err;
        }
    },
    async fetchById(userId) {
        try{
            let document = await UserSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
}
export default user;