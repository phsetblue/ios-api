import { RefreshToken, User } from "../model/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import JwtService from "../service/JwtService.js";
import { refreshTokenValidatorSchema } from "../validators/index.js";
import { RefreshTokenSchema } from "../schema/index.js";

const getdetailsController = {
    async details(req,res,next){
        try{
            // const {error} = refreshTokenValidatorSchema.validate(req.body);
            // if(error) { 
            //     return next(error);
            // }
            // console.log(req.body.refreshToken);
            let refreshtoken = await RefreshToken.fetchByToken({token: req.body.refreshToken});
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
            console.log(`userId = ${userId}`);
            const user = await User.fetchById({_id:userId});
            if(!user) return next(CustomErrorHandler.unAuthorized());

            // const access_token = await JwtService.sign({_id:userId});
            const del = await RefreshToken.delete({ token : refreshToken });

            const refresh_token = await JwtService.sign({_id:user._id},"refresh");
            await RefreshTokenSchema.create({ _id:user._id, token: refresh_token });
            
            res.json({ user, refresh_token });

        }catch(err){
            console.log(err);
            return next(err);
        }
    }
}
export default getdetailsController;