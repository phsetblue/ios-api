import { User } from "../model/index.js";
import { registerValidatorSchema }  from "../validators/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { RefreshTokenSchema } from "../schema/index.js";
import { SALT_FACTOR } from "../config/index.js";

const registerController = {
    async register(req,res,next){
        try{
            console.log(req.body.name);
            const {error} = registerValidatorSchema.validate(req.body);
            if(error){
                return next(error);
            }
            let exist = true;
            const { email } = req.body;
            exist = await User.isEmailExist(email);
            if (exist) return next(CustomErrorHandler.alreadyExist('Email already exist!'));

            const { phoneNumber } = req.body;
            exist = await User.isPhoneNumberExist(phoneNumber);
            if (exist) return next(CustomErrorHandler.alreadyExist('Phone number already exist!'));

            let { password } = req.body;
            const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;
            // console.log({...req.body});
            const document = await User.create({...req.body});
            // console.log(document);
            if(!document) return next(CustomErrorHandler.somethingwrong());

            let access_token;
            let refresh_token;
            access_token = await JwtService.sign({_id:document._id});
            refresh_token = await JwtService.sign({_id:document._id},"refresh");
            await RefreshTokenSchema.create({_id:document._id,token:refresh_token});

            

            res.json({access_token,refresh_token});

        }catch(err){
            return next(err);
        }
    }
}
export default registerController;