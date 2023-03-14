import { RefreshToken, User } from "../model/index.js";
import { RefreshTokenSchema, UserSchema } from "../schema/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import JwtService from "../service/JwtService.js";
// var bcrypt = require('bcryptjs');
import bcrypt from "bcryptjs"
import { loginValidatorSchema, refreshTokenValidatorSchema } from "../validators/index.js";
import { APP_URL } from "../config/index.js";
import emailTemplate from "../service/emailTemplate.js";
import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "pratikh.setblue@gmail.com",
//         pass: "Pratik@123#",
//     },
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
     user: 'noreply@setblue.com',
     pass: 'drfdzagwobiajofw',
    },
   });


const deleteController = {
    async delete(req, res, next) {
        try {
            let refreshtoken = await RefreshToken.fetchByToken({ token: req.body.token });
            if (!refreshtoken) return next(CustomErrorHandler.unAuthorized('Invalid refresh token!'));

            let refreshToken = refreshtoken.token;
            let tokenInfo;
            try {
                tokenInfo = await JwtService.verify(refreshToken, "refresh");
                // console.log(tokenInfo);
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const userId = tokenInfo._id;

            const user = await User.fetchById({ _id: userId });
            if (!user) return next(CustomErrorHandler.unAuthorized());

            console.log("user - ", user);
            console.log("name - ", user.name);
            console.log("email - ", user.email);

            const name = user.name;


            // Generate delete account link
            const deleteAccountToken = await JwtService.sign(
                { userId: userId },
                "24h"
            );

            const deleteAccountLink = `${APP_URL}api/delete-account/${deleteAccountToken}`;

            // Send email to user
            const emailContent = emailTemplate({
                name,
                deleteAccountLink
              });
              
              // Use the emailContent string to send the email
              

            const mailOptions = {
                from: 'pratikh.setblue@gmail.com',
                to: user.email,
                subject: 'QR Code App - Account Deletation Email',
                html: emailContent
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });


            res.status(200).json({ message: "Delete account link sent to email" });
        } catch (err) {
            console.log("dsdsd");
            return next(CustomErrorHandler.somethingwrong());
        }
    },
    async deleteAccount(req, res, next) {
        try {
            const deleteAccountToken = req.params.deleteAccountToken;
            let tokenInfo;
            try {
                tokenInfo = await JwtService.verify(deleteAccountToken, "24h");
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized('Invalid delete account token'));
            }

            const userId = tokenInfo.userId;

            const user = await UserSchema.deleteOne({ _id: userId });
            res.render('deleted');
            // res.status(200).json({ message: "Account deleted successfully" });
        } catch (err) {
            console.log("dsdsd");
            console.log(err);
            return next(CustomErrorHandler.somethingwrong());
        }
    }
}
export default deleteController;