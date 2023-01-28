import Joi from 'joi';

const registerValidator = {

    name: Joi.string().trim().required().min(3).max(100).label("Name"),
    userName: Joi.string().trim().required().label("UserName"),
    email: Joi.string().trim().required().email().label("Email"),
    password: Joi.string().trim().required().min(3).label("Password"),
    // phoneNumber: Joi.number().integer().required().label("Phone number")
    phoneNumber: Joi.string().trim().required().regex(/^[6-9]\d{9}$/).label("Mobile number")
    // what_share: Joi.string().trim().required().label("what_share"),
    // share_value: Joi.string().trim().required().label("share_value"),
}

const registerValidatorSchema = Joi.object(registerValidator);

export {
    registerValidatorSchema
}