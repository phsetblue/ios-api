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
            const { planName, planDetails, planPrice, planDays } = req.body;

            const user = await UserSchema.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        "subscription.subscriptionWarning": false,
                        "subscription.subscriptionMessage": null,
                        "subscription.planName": planName,
                        "subscription.planDetails": planDetails,
                        "subscription.planDays": planDays,
                        "subscription.planPrice": planPrice,
                        "subscription.subscriptionStart": new Date(),
                        "subscription.subscriptionEnd": new Date(
                            Date.now() + planDays * 24 * 60 * 60 * 1000
                        ),
                        "subscription.status": "subscribed",
                    },
                },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            var message = "User Subscription Added successfully.";
            var document = user;
            return res.status(200).json({user, message});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error" });
        }
    }
}
export default subscriptionController;