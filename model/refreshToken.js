import { RefreshTokenSchema } from "../schema/index.js";

const refreshToken = {
    async fetchById(id) {
        try{
            let document = await RefreshTokenSchema.findOne(id);
            console.log(document);
            if(document === null) {
                console.log("inside null");
                let dd = "al";
                return dd;
            } else {
                console.log("Start --------");
                console.log(document);
                console.log("end -------");
                console.log("found");
                return document;
            }
            
        }catch(err){
            console.log("sdhhbsuhdbs");
            return err;
        }
    },
    async fetchByToken(token) {
        try{
            let document = await RefreshTokenSchema.findOne(token);
            // console.log("found");
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