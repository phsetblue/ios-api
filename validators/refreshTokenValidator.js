import Joi from 'joi';

const refreshTokenValidator  = {
    token: Joi.string().required().label("Refresh Token"),
};
const refreshTokenValidatorSchema = Joi.object(refreshTokenValidator);

export default refreshTokenValidatorSchema;