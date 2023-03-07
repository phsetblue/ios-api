import { User } from "../model/index.js";
import { UserSchema } from "../schema/index.js";
import { registerValidatorSchema } from "../validators/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { RefreshTokenSchema } from "../schema/index.js";
import { SALT_FACTOR } from "../config/index.js";
import { RefreshToken } from "../model/index.js";
import { refreshTokenValidatorSchema } from "../validators/index.js";

const subscriptionController = {
    async buy(req, res, next) {
        try {

            let refreshtoken = await RefreshToken.fetchByToken({ token: req.body.token });
            if (!refreshtoken) return next(CustomErrorHandler.unAuthorized('Invalid refresh token!'));

            let refreshToken = refreshtoken.token;
            let tokenInfo;
            try {
                tokenInfo = await JwtService.verify(refreshToken, "refresh");
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const userId = tokenInfo._id;
            const { appleStatus, appleSubType, transactionId, originalTransactionId, signedDate } = req.body;
            console.log("signedDate - ", signedDate);
            // var tra_signeddate = new Date(parseInt(signedDate*1000));
            // const sub_start = tra_signeddate
            // const new_da = tra_signeddate
            // console.log("sub_start - ", sub_start);
            // new_da.setFullYear(new_da.getFullYear() + 1);
            // const sub_end = new_da;
            // console.log("sub_end - ", sub_end);
            // console.log("sub_start - ", sub_start);
            var tra_signeddate = new Date(parseInt(signedDate * 1000));
            const sub_start = tra_signeddate;
            const new_da = new Date(tra_signeddate.getTime());
            console.log("sub_start - ", sub_start);
            new_da.setFullYear(new_da.getFullYear() + 1);
            const sub_end = new_da;
            console.log("sub_end - ", sub_end);
            console.log("sub_start - ", sub_start);


            const user = await UserSchema.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        "subscription.subscriptionWarning": false,
                        "subscription.subscriptionMessage": null,
                        // "subscription.appleStatus": appleStatus,
                        // "subscription.appleSubType": appleSubType,
                        "subscription.status": "subscribed",
                        "subscription.transactionId": transactionId,
                        "subscription.originalTransactionId": originalTransactionId,
                        "subscription.subscriptionStart": sub_start,
                        "subscription.subscriptionEnd": sub_end
                    },
                },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            var message = "User Subscription Added successfully.";
            var document = user;
            return res.status(200).json({ user, message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error" });
        }
    }
}
export default subscriptionController;