import { User } from "../model/index.js";
import { UserSchema } from "../schema/index.js";
import { registerValidatorSchema }  from "../validators/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { RefreshTokenSchema } from "../schema/index.js";
import { SALT_FACTOR } from "../config/index.js";
import { RefreshToken } from "../model/index.js";
import { refreshTokenValidatorSchema } from "../validators/index.js";

const setdetailsController = {
    async setdetails(req,res,next){
        try{
            // const {error} = refreshTokenValidatorSchema.validate(req.body);
            // if(error) { 
            //     return next(error);
            // }
            console.log(req.body);
            let refreshtoken = await RefreshToken.fetchByToken({token: req.body.token});
            // if(!refreshtoken.token) return next(CustomErrorHandler.unAuthorized('Invalid refresh token!'));

            // let refreshToken = refreshtoken.token;
            let refreshToken = refreshtoken.token;
            // console.log(refreshToken);
            // console.log(`dsd = ${refreshToken}`);
            let tokenInfo;
            try {
                tokenInfo = await JwtService.verify(refreshToken,"refresh");
                // console.log(tokenInfo);
            }catch(err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const userId = tokenInfo._id;
            const { what_share, share_value } = req.body;
            console.log(`what_share = ${what_share} ,,,, share_value = ${share_value}`);
            
            // here what code to write for update in user's what_share and share_value

            await UserSchema.findByIdAndUpdate(userId, { what_share, share_value }, { new: true });

            return res.status(200).json({"message": "Succesfully updated"});

        }catch(err){
            return next(err);
        }
    }
}
export default setdetailsController;