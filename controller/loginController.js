import { RefreshToken, User } from "../model/index.js";
import { RefreshTokenSchema } from "../schema/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import JwtService from "../service/JwtService.js";
// var bcrypt = require('bcryptjs');
import bcrypt from "bcryptjs"
import { loginValidatorSchema, refreshTokenValidatorSchema } from "../validators/index.js";
import { APP_URL } from "../config/index.js";


const loginController = {
    async login(req,res,next) {
        try{
            const {error} = loginValidatorSchema.validate(req.body);
            if(error) { 
                return next(error);
            }
            let {email, password} = req.body;
            const user = await User.fetchById({email: email});
            if(!user) return next(CustomErrorHandler.wrongCredential());

            const match = await bcrypt.compare(password,user.password);
            if(!match) return next(CustomErrorHandler.wrongCredential());

            // user.access_token = await JwtService.sign({_id:user._id});
            // user.refresh_token = await JwtService.sign({_id:user._id},"refresh");

            // const access_token = await JwtService.sign({_id:user._id});
            // user.access_token = access_token;

            var refresh_token;
            try {
                const r_t = await RefreshToken.fetchById({_id: user._id});
                console.log(`r_t = ${r_t}`);
                if(r_t === "al") {
                    refresh_token = await JwtService.sign({_id:user._id},"refresh");
                    user.refresh_token = refresh_token;
                    console.log("New Generated");

                    await RefreshTokenSchema.create({ _id:user._id, token: user.refresh_token });
                    
                } else { 
                    refresh_token = r_t.token;
                    console.log("already exist");
                }
            } catch (error) {
                console.log("error generated");
            }


            // old code -start
            // const refresh_token = await JwtService.sign({_id:user._id},"refresh");
            // user.refresh_token = refresh_token;

            // await RefreshTokenSchema.create({ _id:user._id, token: user.refresh_token });

            // old code - end

            // const iosBaseUrl = `${APP_URL}api/ios/${user._id}`;
            // const androidBaseUrl = `${APP_URL}api/android/${user._id}`;
            // const baseUrl = `${APP_URL}api/${user._id}`;

            var message = "User Login Successfully.";

            res.json({user, refresh_token, message});
        }catch(err){
            return next(err);
        }
    },
    async logout(req,res,next){
        try{
            // const {error} = refreshTokenValidatorSchema.validate(req.body);
            // if(error) {
            //     return next(error);
            // }
            // console.log(req);
            // const { refreshToken } = req.body;


            // let refreshToken = req.headers.authorization;
            

            const {error} = refreshTokenValidatorSchema.validate(req.body);
            if(error) { 
                return next(error);
            }
            // console.log(req.body.refreshToken);
            let refreshtoken = await RefreshToken.fetchByToken({token: req.body.refreshToken});
            // if(!refreshtoken.token) return next(CustomErrorHandler.unAuthorized('Invalid refresh token!'));

            // let refreshToken = refreshtoken.token;
            let refreshToken = refreshtoken.token;
            
            // console.log(`refreshToken = ${refreshToken}`);
            // // let refreshTokenInfo = await RefreshToken.fetchById({ userId: req.user.userId, token: refreshToken });
            // let refreshTokenInfo = await RefreshToken.fetchByToken({ token : refreshToken });
            // console.log(`newrefreshToken = ${refreshTokenInfo.token}`);

            // if(!refreshTokenInfo) return next(CustomErrorHandler.unAuthorized('Invalid refresh token!'));
            const del = await RefreshToken.delete({ token : refreshToken });
            console.log(del);
            res.json({ message: "Logged out successful" });
        }catch(err) {
            console.log("dsdsd");
            return next(CustomErrorHandler.somethingwrong());
        }
    }
}
export default loginController;