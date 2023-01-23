import { RefreshTokenSchema } from "../schema/index.js";

const refreshToken = {
    async fetchByToken(token) {
        try{
            let document = await RefreshTokenSchema.findOne(token);
            console.log("found");
            return document;
        }catch(err){
            console.log("sdhhbsuhdbs");
            return err;
        }
    },
    async delete(token) {
        try{
            let document = await RefreshTokenSchema.deleteOne(token);
            console.log(document);
            return document;
        }catch(err) {   
            console.log("djsdsg");
            return err;
        }
    }
}
export default refreshToken;