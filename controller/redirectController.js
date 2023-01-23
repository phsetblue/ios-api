import { RefreshToken, User } from "../model/index.js";
import { RefreshTokenSchema } from "../schema/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import JwtService from "../service/JwtService.js";
// var bcrypt = require('bcryptjs');
import bcrypt from "bcryptjs"
import { loginValidatorSchema, refreshTokenValidatorSchema } from "../validators/index.js";
import { APP_URL } from "../config/index.js";


const redirectController = {
    async in(req,res,next) {
        try{
            const id = req.params.id;
            console.log(`id = ${id}`);
            const user = await User.fetchById({_id: id});
            if(!user) return next(CustomErrorHandler.wrongCredential());

            console.log(user);
            
            var newres = "";
            if(user.what_share === 'email') {
                const mail_add = user.share_value;
                console.log(`mail_add = ${mail_add}`);
                newres = `mailto:${mail_add}`
                console.log(newres);
                user.share_redirect = newres;
            } else if(user.what_share === 'whatsapp') {
                const whatsapp_add = user.share_value;
                console.log(`whatsapp_add = ${whatsapp_add}`);
                var ua = req.headers['user-agent'].toLowerCase();
                if(/iphone|ipad|ipod/.test(ua)){
                    newres = `facetime-audio:${whatsapp_add}`;
                }else{
                    newres = `https://wa.me/${whatsapp_add}`;
                }
                user.share_redirect = newres;
            } else if(user.what_share === 'mobile') {
                const mobile_add = user.share_value;
                newres = `tel:${mobile_add}`;
                user.share_redirect = newres;
            } else {
                console.log("it djnfjdnm");
            }

            res.redirect(newres)
        }catch(err){
            return next(err);
        }
    }
}
export default redirectController;