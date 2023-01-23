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
            const id = req.body.id;

            const user = await User.fetchById({id: id});
            if(!user) return next(CustomErrorHandler.wrongCredential());

            var newres;
            if(user.what_share === 'email') {
                const mail_add = user.share_value;
                newres = `mailto:${mail_add}`
                // console.log(newres);
                user.share_redirect = newres;
            } else if(user.what_share === 'whatsapp') {
                const whatsapp_add = user.share_value;
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

            res.redirect(newres);
        }catch(err){
            return next(err);
        }
    }
}
export default redirectController;