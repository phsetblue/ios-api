import { RefreshToken, User } from "../model/index.js";
import { UserSchema } from "../schema/index.js";
import { registerValidatorSchema } from "../validators/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { RefreshTokenSchema } from "../schema/index.js";
import { APP_URL, SALT_FACTOR } from "../config/index.js";

const registerController = {
    async register(req, res, next) {
        try {
            // console.log(req.body.name);
            // const {error} = registerValidatorSchema.validate(req.body);
            // if(error){
            //     return next(error);
            // }
            let exist = true;

            const { name } = req.body;
            if (name.length < 3) {
                return next(CustomErrorHandler.somethingwrong('name should have atleast 3 characters!'));
            };

            const { userName } = req.body;
            if (userName.length < 3) {
                return next(CustomErrorHandler.somethingwrong('username should have atleast 3 characters!'));
            };

            const { email } = req.body;
            // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            // if(re.test(email) === null) {
            // } else {
            //     return next(CustomErrorHandler.somethingwrong('Invalid email address'));
            // };

            const { password } = req.body;
            if (password.length < 3) {
                return next(CustomErrorHandler.somethingwrong('password should have atleast 3 characters!'));
            };

            const { phoneNumber } = req.body;
            if (phoneNumber.length < 10) {
                return next(CustomErrorHandler.somethingwrong('phone number should have 10 digits!'));
            };
            if (phoneNumber[0] === '6' || phoneNumber[0] === '7' || phoneNumber[0] === '8' || phoneNumber[0] === '9') {

            } else {
                return next(CustomErrorHandler.somethingwrong('please enter valid phone number.'));
            }




            // const { userName } = req.body;
            exist = await User.isUsernameExist(userName);
            if (exist) return next(CustomErrorHandler.alreadyExist('userName already exist!'));

            // const { email } = req.body;
            exist = await User.isEmailExist(email);
            if (exist) return next(CustomErrorHandler.alreadyExist('Email already exist!'));

            // const { phoneNumber } = req.body;
            exist = await User.isPhoneNumberExist(phoneNumber);
            if (exist) return next(CustomErrorHandler.alreadyExist('Phone number already exist!'));

            // let { password } = req.body;
            const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;
            // console.log({...req.body});
            const document = await User.create({ ...req.body });
            // console.log(document);
            if (!document) return next(CustomErrorHandler.somethingwrong());
            // console.log(document);

            let access_token;
            let refresh_token;
            // access_token = await JwtService.sign({_id:document._id});
            refresh_token = await JwtService.sign({ _id: document._id }, "refresh");
            await RefreshTokenSchema.create({ _id: document._id, token: refresh_token });

            // const iosBaseUrl = `${APP_URL}api/ios/${document._id}`;
            // const androidBaseUrl = `${APP_URL}api/android/${document._id}`;
            const baseUrl = `${APP_URL}api/${document._id}`;

            // console.log(document);

            await UserSchema.findByIdAndUpdate(document._id, { baseUrl }, { new: true });

            document.baseUrl = baseUrl;
            // console.log(document);

            var message = "User Registration successful."

            res.json({ document, refresh_token, message });

        } catch (err) {
            return next(err);
        }
    },
    async updatedetails(req, res, next) {
        try {
            let refreshtoken = await RefreshToken.fetchByToken({ token: req.body.refreshToken });
            let refreshToken = refreshtoken.token;
            // console.log(refreshToken);
            // console.log(`dsd = ${refreshToken}`);
            let tokenInfo;
            try {
                tokenInfo = await JwtService.verify(refreshToken, "refresh");
                // console.log(tokenInfo);
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const userId = tokenInfo._id;
            // console.log(`userId = ${userId}`);
            const user = await User.fetchById({ _id: userId });
            if (!user) return next(CustomErrorHandler.unAuthorized());


            if (req.body.name && req.body.phoneNumber && req.body.password) {

                const { name } = req.body;
                if (name.length < 3) {
                    return next(CustomErrorHandler.somethingwrong('name should have atleast 3 characters!'));
                };

                const { password } = req.body;
                if (password.length < 6) {
                    return next(CustomErrorHandler.somethingwrong('password should have atleast 6 characters!'));
                };

                const { phoneNumber } = req.body;
                if (phoneNumber.length < 10) {
                    return next(CustomErrorHandler.somethingwrong('phone number should have 10 digits!'));
                };
                if (phoneNumber[0] === '6' || phoneNumber[0] === '7' || phoneNumber[0] === '8' || phoneNumber[0] === '9') {

                } else {
                    return next(CustomErrorHandler.somethingwrong('please enter valid phone number.'));
                }

                const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
                const hashedPassword = await bcrypt.hash(password, salt);
                var newpassword = hashedPassword;

                var updated_user = await UserSchema.findByIdAndUpdate(userId, {
                    name,
                    phoneNumber,
                    password: newpassword
                },{new : true});

                if(updated_user) {
                    var info = updated_user;
                    var message = "User Info Updated Successfully!";
                    return res.status(200).json({info, refresh_token: req.body.refreshToken, message});
                } else  {
                    return next(CustomErrorHandler.somethingwrong());
                }


            } else if (req.body.name && req.body.phoneNumber) {

                const { name } = req.body;
                if (name.length < 3) {
                    return next(CustomErrorHandler.somethingwrong('name should have atleast 3 characters!'));
                };

                const { phoneNumber } = req.body;
                if (phoneNumber.length < 10) {
                    return next(CustomErrorHandler.somethingwrong('phone number should have 10 digits!'));
                };
                if (phoneNumber[0] === '6' || phoneNumber[0] === '7' || phoneNumber[0] === '8' || phoneNumber[0] === '9') {

                } else {
                    return next(CustomErrorHandler.somethingwrong('please enter valid phone number.'));
                }


                var updated_user = await UserSchema.findByIdAndUpdate(userId, {
                    name,
                    phoneNumber
                },{new : true});

                if(updated_user) {
                    var info = updated_user;
                    var message = "User Info Updated Successfully!";
                    return res.status(200).json({info, refresh_token: req.body.refreshToken, message});
                } else  {
                    return next(CustomErrorHandler.somethingwrong());
                }

            } else if (req.body.phoneNumber && req.body.password) {

                const { password } = req.body;
                if (password.length < 6) {
                    return next(CustomErrorHandler.somethingwrong('password should have atleast 6 characters!'));
                };

                const { phoneNumber } = req.body;
                if (phoneNumber.length < 10) {
                    return next(CustomErrorHandler.somethingwrong('phone number should have 10 digits!'));
                };
                if (phoneNumber[0] === '6' || phoneNumber[0] === '7' || phoneNumber[0] === '8' || phoneNumber[0] === '9') {

                } else {
                    return next(CustomErrorHandler.somethingwrong('please enter valid phone number.'));
                }

                const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
                const hashedPassword = await bcrypt.hash(password, salt);
                var newpassword = hashedPassword;

                var updated_user = await UserSchema.findByIdAndUpdate(userId, {
                    phoneNumber,
                    password: newpassword
                },{new : true});

                if(updated_user) {
                    var info = updated_user;
                    var message = "User Info Updated Successfully!";
                    return res.status(200).json({info, refresh_token: req.body.refreshToken, message});
                } else  {
                    return next(CustomErrorHandler.somethingwrong());
                }

            } else if (req.body.name && req.body.password) {

                const { name } = req.body;
                if (name.length < 3) {
                    return next(CustomErrorHandler.somethingwrong('name should have atleast 3 characters!'));
                };

                const { password } = req.body;
                if (password.length < 6) {
                    return next(CustomErrorHandler.somethingwrong('password should have atleast 6 characters!'));
                };

                const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
                const hashedPassword = await bcrypt.hash(password, salt);
                var newpassword = hashedPassword;

                var updated_user = await UserSchema.findByIdAndUpdate(userId, {
                    name,
                    password: newpassword
                },{new : true});

                if(updated_user) {
                    var info = updated_user;
                    var message = "User Info Updated Successfully!";
                    return res.status(200).json({info, refresh_token: req.body.refreshToken, message});
                } else  {
                    return next(CustomErrorHandler.somethingwrong());
                }

            } else if (req.body.name) {

                const { name } = req.body;
                if (name.length < 3) {
                    return next(CustomErrorHandler.somethingwrong('name should have atleast 3 characters!'));
                };

                var updated_user = await UserSchema.findByIdAndUpdate(userId, {
                    name
                },{new : true});

                if(updated_user) {
                    var info = updated_user;
                    var message = "User Info Updated Successfully!";
                    return res.status(200).json({info, refresh_token: req.body.refreshToken, message});
                } else  {
                    return next(CustomErrorHandler.somethingwrong());
                }

            } else if (req.body.phoneNumber) {

                const { phoneNumber } = req.body;
                if (phoneNumber.length < 10) {
                    return next(CustomErrorHandler.somethingwrong('phone number should have 10 digits!'));
                };
                if (phoneNumber[0] === '6' || phoneNumber[0] === '7' || phoneNumber[0] === '8' || phoneNumber[0] === '9') {

                } else {
                    return next(CustomErrorHandler.somethingwrong('please enter valid phone number.'));
                }

                var updated_user = await UserSchema.findByIdAndUpdate(userId, {
                    phoneNumber
                },{new : true});

                if(updated_user) {
                    var info = updated_user;
                    var message = "User Info Updated Successfully!";
                    return res.status(200).json({info, refresh_token: req.body.refreshToken, message});
                } else  {
                    return next(CustomErrorHandler.somethingwrong());
                }

            } else if (req.body.password) {

                const { password } = req.body;
                if (password.length < 6) {
                    return next(CustomErrorHandler.somethingwrong('password should have atleast 6 characters!'));
                };

                const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
                const hashedPassword = await bcrypt.hash(password, salt);
                var newpassword = hashedPassword;

                var updated_user = await UserSchema.findByIdAndUpdate(userId, {
                    password: newpassword
                },{new : true});

                if(updated_user) {
                    var info = updated_user;
                    var message = "User Info Updated Successfully!";
                    return res.status(200).json({info, refresh_token: req.body.refreshToken, message});
                } else  {
                    return next(CustomErrorHandler.somethingwrong());
                }

            } else {
                return res.status(500).json({ message: "Please Enter atleast one filed to update!" });
            }
        } catch (err) {
            return next(err);
        }
    }
}
export default registerController;
